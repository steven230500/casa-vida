import { createHmac, timingSafeEqual, scryptSync, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { users, type Role } from '@/lib/db/schema'

export const SESSION_COOKIE = 'casavida_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? 'dev-only-secret-change-me'
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const hashBuffer = Buffer.from(hash, 'hex')
  const derivedBuffer = scryptSync(password, salt, 64)
  if (hashBuffer.length !== derivedBuffer.length) return false
  return timingSafeEqual(hashBuffer, derivedBuffer)
}

export type SessionPayload = {
  userId: string
  email: string
  fullName: string
  role: Role
  pastorName: string | null
  exp: number
}

export function createSessionToken(user: Omit<SessionPayload, 'exp'>) {
  const payload: SessionPayload = { ...user, exp: Date.now() + SESSION_TTL_MS }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${payloadB64}.${sign(payloadB64)}`
}

export function verifySessionToken(
  token: string | undefined | null,
): SessionPayload | null {
  if (!token) return null
  const [payloadB64, sig] = token.split('.')
  if (!payloadB64 || !sig) return null

  const expected = sign(payloadB64)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString(),
    ) as SessionPayload
    if (typeof payload.exp !== 'number' || payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

/**
 * Two ways in: the original single env-var admin (kept so the existing
 * bookmarked login keeps working) or a real row in `users` for
 * pastor/servidor/extra-admin accounts.
 */
export async function authenticate(
  identifier: string,
  password: string,
): Promise<Omit<SessionPayload, 'exp'> | null> {
  const envUser = process.env.ADMIN_USERNAME ?? ''
  const envPass = process.env.ADMIN_PASSWORD ?? ''
  if (envUser && envPass && identifier === envUser && password === envPass) {
    return {
      userId: 'env-admin',
      email: envUser,
      fullName: 'Admin',
      role: 'admin',
      pastorName: null,
    }
  }

  const db = getDb()
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, identifier.toLowerCase()))
    .limit(1)

  if (!user || !verifyPassword(password, user.passwordHash)) return null

  return {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    pastorName: user.pastorName,
  }
}
