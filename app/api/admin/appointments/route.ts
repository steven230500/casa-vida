import { NextResponse } from 'next/server'
import { listAppointments } from '@/lib/schedule'

export async function GET() {
  const appointments = await listAppointments()
  return NextResponse.json({ appointments })
}
