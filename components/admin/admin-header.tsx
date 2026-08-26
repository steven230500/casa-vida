'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LogoMark } from '@/components/brand/logo'
import { LogoutButton } from '@/components/admin/logout-button'

type NavItem = { href: string; label: string }

// Below sm, the logo + full nav + user name + Salir never fit on one row
// (measured overflow at ~650px on a 375px viewport) - collapse the nav and
// user info into a toggleable panel instead of letting it force horizontal
// scroll on the whole page.
export function AdminHeader({
  items,
  userName,
}: {
  items: NavItem[]
  userName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-foreground/10">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-foreground"
          >
            <LogoMark className="size-6" />
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              Panel
            </span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Admin">
            {items.map((item) => (
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
          {userName && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName}
            </span>
          )}
          <div className="hidden sm:block">
            <LogoutButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="text-foreground sm:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-foreground/10 px-5 py-4 sm:hidden">
          <nav className="flex flex-col gap-1" aria-label="Admin (móvil)">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-3">
            {userName && (
              <span className="text-sm text-muted-foreground">
                {userName}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      )}
    </header>
  )
}
