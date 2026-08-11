import { NextResponse } from 'next/server'
import { deleteAvailability, getAvailabilityPastorName } from '@/lib/schedule'
import { getSession } from '@/lib/auth'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await getSession()

  if (session?.role === 'pastor') {
    const owner = await getAvailabilityPastorName(id)
    if (owner !== session.pastorName) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  }

  const ok = await deleteAvailability(id)

  if (!ok) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
