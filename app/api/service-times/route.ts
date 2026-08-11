import { NextResponse } from 'next/server'
import { listActiveServiceTimes } from '@/lib/store'

export async function GET() {
  const serviceTimes = await listActiveServiceTimes()
  return NextResponse.json({ serviceTimes })
}
