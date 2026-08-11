import { NextResponse } from 'next/server'
import { updateAppointmentStatus } from '@/lib/schedule'
import { appointmentStatusValues } from '@/lib/db/schema'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  if (!appointmentStatusValues.includes(body.status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const appointment = await updateAppointmentStatus(id, body.status)

  if (!appointment) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ appointment })
}
