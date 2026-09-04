import { AdminHeader } from '@/components/admin/admin-header'
import { getSession } from '@/lib/auth'
import type { Role } from '@/lib/db/schema'

const NAV_ITEMS: { href: string; label: string; roles: Role[] }[] = [
  { href: '/admin/eventos', label: 'Eventos', roles: ['admin'] },
  { href: '/admin/horarios', label: 'Horarios', roles: ['admin'] },
  { href: '/admin/enlaces', label: 'Enlaces', roles: ['admin'] },
  { href: '/admin/personas', label: 'Personas', roles: ['admin', 'servidor', 'pastor'] },
  { href: '/admin/agenda', label: 'Agenda', roles: ['admin', 'pastor'] },
  { href: '/admin/usuarios', label: 'Usuarios', roles: ['admin'] },
]

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const role = session?.role ?? 'admin'
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader items={visibleItems} userName={session?.fullName} />
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  )
}
