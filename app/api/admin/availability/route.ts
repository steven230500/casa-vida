import { NextResponse } from 'next/server'
import { listAvailability, createAvailability } from '@/lib/schedule'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const availability = await listAvailability(
    session?.role === 'pastor' ? (session.pastorName ?? undefined) : undefined,
  )
  return NextResponse.json({ availability })
}

export async function POST(request: Request) {
  const session = await getSession()
  const body = await request.json()

  // Pastors can only create blocks under their own name, regardless of
  // what the request body says.
  if (session?.role === 'pastor') {
    if (!session.pastorName) {
      return NextResponse.json(
        { error: 'Tu cuenta no está vinculada a un nombre de pastor' },
        { status: 403 },
      )
    }
    body.pastorName = session.pastorName
  }

  if (
    typeof body.pastorName !== 'string' ||
    !body.pastorName.trim() ||
    typeof body.dayOfWeek !== 'number' ||
    body.dayOfWeek < 0 ||
    body.dayOfWeek > 6 ||
    typeof body.startTime !== 'string' ||
    typeof body.endTime !== 'string' ||
    typeof body.slotMinutes !== 'number' ||
    body.slotMinutes < 5
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  if (body.startTime >= body.endTime) {
    return NextResponse.json(
      { error: 'La hora de inicio debe ser antes de la hora de fin' },
      { status: 400 },
    )
  }

  const availability = await createAvailability(body)
  return NextResponse.json({ availability }, { status: 201 })
}
