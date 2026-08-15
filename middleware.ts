import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from '@/lib/auth'

export const runtime = 'nodejs'

// Logging out must work regardless of role or even an already-invalid
// session - otherwise non-admin roles get 403'd by the role check below
// before the route handler ever runs, and their cookie never actually
// gets cleared (this was a real bug: admin could log out fine since it
// bypasses the role check entirely, pastor/servidor could not).
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/login', '/api/admin/logout']

// admin-only sections - eventos/horarios stay a single-owner concern.
const ADMIN_ONLY = [
  '/admin/eventos',
  '/api/admin/events',
  '/admin/horarios',
  '/api/admin/service-times',
  '/admin/usuarios',
  '/api/admin/users',
]

// servidor: read-only on Personas, no other admin section.
const SERVIDOR_ALLOWED_PREFIXES = ['/admin/personas', '/api/admin/people']

// pastor: only Agenda (their own availability/appointments - the actual
// per-pastor row scoping happens in the route handlers, not here).
const PASTOR_ALLOWED_PREFIXES = [
  '/admin/agenda',
  '/api/admin/availability',
  '/api/admin/appointments',
]

function denied(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  // Send them somewhere their role can actually see instead of a dead end.
  return NextResponse.redirect(new URL('/admin', request.url))
}

function checkRoleAccess(
  request: NextRequest,
  session: SessionPayload,
): NextResponse | null {
  const { pathname } = request.nextUrl
  if (session.role === 'admin') return null

  // The bare index just internally redirects to whatever the role can
  // actually see - exempt it, or a non-admin lands in a redirect loop.
  if (pathname === '/admin') return null

  if (ADMIN_ONLY.some((p) => pathname.startsWith(p))) return denied(request)

  if (session.role === 'servidor') {
    const allowed = SERVIDOR_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p))
    if (!allowed) return denied(request)
    // Read-only: any write to /api/admin/people is admin-only.
    if (pathname.startsWith('/api/admin/people') && request.method !== 'GET') {
      return denied(request)
    }
  }

  if (session.role === 'pastor') {
    const allowed = PASTOR_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p))
    if (!allowed) return denied(request)
  }

  return null
}

// Admin pages must never be served from the browser's back/forward cache -
// otherwise hitting "back" after logging out can show a fully rendered
// previous session's page straight from memory, without a request ever
// reaching this middleware to catch it.
function withNoStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, must-revalidate')
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return withNoStore(NextResponse.next())
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = verifySessionToken(token)

  if (!session) {
    if (pathname.startsWith('/api/admin')) {
      return withNoStore(NextResponse.json({ error: 'No autorizado' }, { status: 401 }))
    }
    const loginUrl = new URL('/admin/login', request.url)
    return withNoStore(NextResponse.redirect(loginUrl))
  }

  const roleCheck = checkRoleAccess(request, session)
  if (roleCheck) return withNoStore(roleCheck)

  return withNoStore(NextResponse.next())
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
