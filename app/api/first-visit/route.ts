import { NextResponse } from 'next/server'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { firstVisitSchema } from '@/lib/schemas'
import { church } from '@/lib/data'

const serviceLabels = {
  domingo: 'Servicio dominical · 10:00 a.m.',
  jovenes: 'Jóvenes · sábados 5:00 p.m.',
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = firstVisitSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const { name, email, phone, service, kids, message } = parsed.data

  try {
    const { error } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: church.email,
      replyTo: email,
      subject: `Primera visita: ${name}`,
      text: [
        `Nombre: ${name}`,
        `Correo: ${email}`,
        phone ? `Teléfono: ${phone}` : null,
        `Viene a: ${serviceLabels[service]}`,
        kids ? `Niños: ${kids}` : null,
        message ? `Mensaje: ${message}` : null,
      ]
        .filter(Boolean)
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
