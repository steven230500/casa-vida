import { NextResponse } from 'next/server'
import { listPeople, createPerson } from '@/lib/people'
import { peopleStatusValues } from '@/lib/db/schema'

export async function GET() {
  const people = await listPeople()
  return NextResponse.json({ people })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (
    typeof body.fullName !== 'string' ||
    body.fullName.trim().length < 2 ||
    !peopleStatusValues.includes(body.status)
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const person = await createPerson({
    fullName: body.fullName,
    email: body.email || null,
    phone: body.phone || null,
    birthdate: body.birthdate || null,
    status: body.status,
    notes: body.notes || null,
  })
  return NextResponse.json({ person }, { status: 201 })
}
