import { NextResponse } from 'next/server'
import { updatePerson, deletePerson } from '@/lib/people'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  try {
    const person = await updatePerson(id, {
      ...body,
      email: body.email || null,
      phone: body.phone || null,
      birthdate: body.birthdate || null,
      notes: body.notes || null,
    })

    if (!person) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json({ person })
  } catch (error) {
    console.error('Error updating person:', error)
    return NextResponse.json(
      { error: 'No se pudo guardar los cambios' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const ok = await deletePerson(id)

  if (!ok) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
