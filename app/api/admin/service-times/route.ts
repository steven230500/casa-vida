import { NextResponse } from 'next/server'
import { listServiceTimes, replaceServiceTimes } from '@/lib/store'

export async function GET() {
  const serviceTimes = await listServiceTimes()
  return NextResponse.json({ serviceTimes })
}

export async function PUT(request: Request) {
  const body = await request.json()

  if (!Array.isArray(body.serviceTimes)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  for (const s of body.serviceTimes) {
    if (
      typeof s.day !== 'string' ||
      typeof s.time !== 'string' ||
      typeof s.title !== 'string' ||
      typeof s.description !== 'string'
    ) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
  }

  const serviceTimes = await replaceServiceTimes(body.serviceTimes)
  return NextResponse.json({ serviceTimes })
}
