import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'casavida_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? 'dev-only-secret-change-me'
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createSessionToken(username: string) {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  return `${payloadB64}.${sign(payloadB64)}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payloadB64, sig] = token.split('.')
  if (!payloadB64 || !sig) return false

  const expected = sign(payloadB64)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export function checkCredentials(username: string, password: string) {
  const validUser = process.env.ADMIN_USERNAME ?? ''
  const validPass = process.env.ADMIN_PASSWORD ?? ''
  if (!validUser || !validPass) return false
  return username === validUser && password === validPass
}
