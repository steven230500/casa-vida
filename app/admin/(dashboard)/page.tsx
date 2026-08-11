import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminIndexPage() {
  const session = await getSession()
  const landing =
    session?.role === 'pastor'
      ? '/admin/agenda'
      : session?.role === 'servidor'
        ? '/admin/personas'
        : '/admin/eventos'
  redirect(landing)
}
