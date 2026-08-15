import { NextResponse } from 'next/server'
import { deleteUser, updateUser } from '@/lib/users'
import { roleValues } from '@/lib/db/schema'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  if (
    typeof body.email !== 'string' ||
    !body.email.includes('@') ||
    typeof body.fullName !== 'string' ||
    !body.fullName.trim() ||
    !roleValues.includes(body.role) ||
    (body.password && body.password.length < 8)
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  if (body.role === 'pastor' && !String(body.pastorName ?? '').trim()) {
    return NextResponse.json(
      { error: 'El rol pastor necesita un nombre de pastor' },
      { status: 400 },
    )
  }

  try {
    const user = await updateUser(id, {
      email: body.email,
      password: body.password || undefined,
      fullName: body.fullName,
      role: body.role,
      pastorName: body.pastorName,
    })

    if (!user) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese correo' },
        { status: 409 },
      )
    }
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'No se pudo actualizar el usuario' }, { status: 500 })
  }
}

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
