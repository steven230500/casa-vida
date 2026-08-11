import { NextResponse } from 'next/server'
import { authenticate, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (typeof username !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const user = await authenticate(username, password)

  if (!user) {
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos' },
      { status: 401 },
    )
  }

  const res = NextResponse.json({ ok: true, role: user.role })
  res.cookies.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
