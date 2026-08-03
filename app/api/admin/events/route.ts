import { NextResponse } from 'next/server'
import { listEvents, createEvent } from '@/lib/store'

export async function GET() {
  const events = await listEvents()
  return NextResponse.json({ events })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (
    typeof body.title !== 'string' ||
    typeof body.date !== 'string' ||
    typeof body.time !== 'string' ||
    typeof body.location !== 'string' ||
    typeof body.category !== 'string' ||
    typeof body.description !== 'string' ||
    typeof body.image !== 'string' ||
    typeof body.registration !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const event = await createEvent(body)
  return NextResponse.json({ event }, { status: 201 })
}
