import { NextResponse } from 'next/server'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { prayerSchema } from '@/lib/schemas'
import { church } from '@/lib/data'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = prayerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { anonymous, name, email, request: prayerRequest } = parsed.data

  try {
    const { error } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: church.email,
      ...(anonymous ? {} : { replyTo: email }),
      subject: anonymous
        ? 'Petición de oración anónima'
        : `Petición de oración: ${name}`,
      text: [
        anonymous ? 'Enviada de forma anónima' : `Nombre: ${name}`,
        anonymous ? null : `Correo: ${email}`,
        '',
        prayerRequest,
      ]
        .filter((line) => line !== null)
        .join('\n'),
    })

    if (error) {
      return NextResponse.json({ error: 'No se pudo enviar' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'No se pudo enviar' }, { status: 502 })
  }
}
