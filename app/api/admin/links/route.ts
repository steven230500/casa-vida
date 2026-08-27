import { NextResponse } from 'next/server'
import { listLinks, replaceLinks } from '@/lib/store'
import { linkIconKeys } from '@/lib/data'

export async function GET() {
  const links = await listLinks()
  return NextResponse.json({ links })
}

export async function PUT(request: Request) {
  const body = await request.json()

  if (!Array.isArray(body.links)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  for (const l of body.links) {
    if (
      typeof l.title !== 'string' ||
      typeof l.url !== 'string' ||
      typeof l.active !== 'boolean' ||
      !linkIconKeys.includes(l.icon)
    ) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }
  }

  const links = await replaceLinks(body.links)
  return NextResponse.json({ links })
}
