import { NextResponse } from 'next/server'
import { deleteUser } from '@/lib/users'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const ok = await deleteUser(id)

  if (!ok) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
