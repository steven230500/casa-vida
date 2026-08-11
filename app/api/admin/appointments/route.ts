import { NextResponse } from 'next/server'
import { listAppointments } from '@/lib/schedule'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  const appointments = await listAppointments(
    session?.role === 'pastor' ? (session.pastorName ?? undefined) : undefined,
  )
  return NextResponse.json({ appointments })
}
