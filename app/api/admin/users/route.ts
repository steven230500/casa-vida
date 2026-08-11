import { NextResponse } from 'next/server'
import { listUsers, createUser } from '@/lib/users'
import { roleValues } from '@/lib/db/schema'

export async function GET() {
  const users = await listUsers()
  return NextResponse.json({ users })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (
    typeof body.email !== 'string' ||
    !body.email.includes('@') ||
    typeof body.password !== 'string' ||
    body.password.length < 8 ||
    typeof body.fullName !== 'string' ||
    !body.fullName.trim() ||
    !roleValues.includes(body.role)
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
    const user = await createUser({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      role: body.role,
      pastorName: body.pastorName,
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese correo' },
        { status: 409 },
      )
    }
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'No se pudo crear el usuario' }, { status: 500 })
  }
}
