import { NextResponse } from 'next/server'
import { listAvailability, createAvailability } from '@/lib/schedule'

export async function GET() {
  const availability = await listAvailability()
  return NextResponse.json({ availability })
}

export async function POST(request: Request) {
  const body = await request.json()

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
