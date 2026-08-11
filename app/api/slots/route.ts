import { NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/schedule'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 })
  }

  const slots = await getAvailableSlots(date)
  return NextResponse.json({ slots })
}
