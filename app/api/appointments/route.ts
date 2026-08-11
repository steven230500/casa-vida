import { NextResponse } from 'next/server'
import { createAppointment } from '@/lib/schedule'
import { getResend, FROM_ADDRESS } from '@/lib/resend'
import { church } from '@/lib/data'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

export async function POST(request: Request) {
  const body = await request.json()

  if (
    typeof body.availabilityId !== 'string' ||
    typeof body.name !== 'string' ||
    body.name.trim().length < 2 ||
    typeof body.email !== 'string' ||
    !body.email.includes('@') ||
    typeof body.date !== 'string' ||
    !DATE_RE.test(body.date) ||
    typeof body.startTime !== 'string' ||
    !TIME_RE.test(body.startTime) ||
    typeof body.endTime !== 'string' ||
    !TIME_RE.test(body.endTime)
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const appointment = await createAppointment({
    availabilityId: body.availabilityId,
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    notes: body.notes || null,
  })

  if (!appointment) {
    return NextResponse.json(
      { error: 'Ese horario ya no está disponible, elige otro.' },
      { status: 409 },
    )
  }

  try {
    const resend = getResend()
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: church.email,
      replyTo: body.email,
      subject: `Nueva cita: ${body.name} — ${body.date} ${body.startTime}`,
      text: `${body.name} agendó una cita el ${body.date} a las ${body.startTime}.\nCorreo: ${body.email}${body.phone ? `\nTeléfono: ${body.phone}` : ''}${body.notes ? `\nNotas: ${body.notes}` : ''}`,
    })
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: body.email,
      subject: 'Tu cita con Casa Vida está confirmada',
      text: `Hola ${body.name},\n\nTu cita quedó agendada para el ${body.date} a las ${body.startTime}.\n\nTe esperamos en ${church.address}.\n\nCasa Vida`,
    })
  } catch {
    // Booking already succeeded - a failed confirmation email shouldn't fail the request.
  }

  return NextResponse.json({ appointment }, { status: 201 })
}
