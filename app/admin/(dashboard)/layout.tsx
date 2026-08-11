import Link from 'next/link'
import { LogoMark } from '@/components/brand/logo'
import { LogoutButton } from '@/components/admin/logout-button'
import { getSession } from '@/lib/auth'
import type { Role } from '@/lib/db/schema'

const NAV_ITEMS: { href: string; label: string; roles: Role[] }[] = [
  { href: '/admin/eventos', label: 'Eventos', roles: ['admin'] },
  { href: '/admin/horarios', label: 'Horarios', roles: ['admin'] },
  { href: '/admin/personas', label: 'Personas', roles: ['admin', 'servidor'] },
  { href: '/admin/agenda', label: 'Agenda', roles: ['admin', 'pastor'] },
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
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-foreground"
            >
              <LogoMark className="size-6" strokeWidth={5} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase">
                Panel
              </span>
            </Link>
            <nav className="flex items-center gap-6" aria-label="Admin">
              {visibleItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {session && (
              <span className="text-sm text-muted-foreground">
                {session.fullName}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  )
}
