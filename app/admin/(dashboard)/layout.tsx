import Link from 'next/link'
import { LogoMark } from '@/components/brand/logo'
import { LogoutButton } from '@/components/admin/logout-button'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/eventos"
              className="flex items-center gap-2 text-foreground"
            >
              <LogoMark className="size-6" strokeWidth={5} />
              <span className="text-sm font-semibold tracking-[0.2em] uppercase">
                Panel
              </span>
            </Link>
            <nav className="flex items-center gap-6" aria-label="Admin">
              <Link
                href="/admin/eventos"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Eventos
              </Link>
              <Link
                href="/admin/horarios"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Horarios
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  )
}
