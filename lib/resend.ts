import { Resend } from 'resend'

let client: Resend | null = null

export function getResend() {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY)
  }
  return client
}

export const FROM_ADDRESS = 'Casa Vida <no-reply@casavidactg.com>'
