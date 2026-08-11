import { NextResponse } from 'next/server'
import { listServiceTimes } from '@/lib/store'

export async function GET() {
  const serviceTimes = await listServiceTimes()
  return NextResponse.json({ serviceTimes })
}
