import { NextResponse } from 'next/server'
import { updateAppointmentStatus, getAppointmentPastorName } from '@/lib/schedule'
import { appointmentStatusValues } from '@/lib/db/schema'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()
  const session = await getSession()

  if (!appointmentStatusValues.includes(body.status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  if (session?.role === 'pastor') {
    const owner = await getAppointmentPastorName(id)
    if (owner !== session.pastorName) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  }

  const appointment = await updateAppointmentStatus(id, body.status)

  if (!appointment) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ appointment })
}
