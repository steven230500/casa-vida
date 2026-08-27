import type { Metadata } from 'next'
import Image from 'next/image'
import { Logo } from '@/components/brand/logo'
import { LINK_ICONS } from '@/components/brand/link-icons'
import { listActiveLinks } from '@/lib/store'
import { church } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Enlaces — Casa Vida',
  description: `Todos los enlaces de ${church.name}, ${church.city}, en un solo lugar.`,
}

function isExternal(url: string) {
  return !url.startsWith('mailto:') && !url.startsWith('tel:')
}

const GALLERY = [
  '/images/real-hero.jpg',
  '/images/real-worship.jpg',
  '/images/real-comunidad.jpg',
  '/images/real-jovenes.jpg',
  '/images/real-bautismo-1.jpg',
  '/images/real-ninos.jpg',
]

export default async function EnlacesPage() {
  const links = await listActiveLinks()

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-foreground px-5 py-16">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-1 sm:grid-cols-3 sm:grid-rows-2">
        {GALLERY.map((src) => (
          <div key={src} className="relative">
            <Image src={src} alt="" fill sizes="34vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-foreground/85" />

      <div className="relative flex w-full flex-col items-center">
        <Logo
          className="flex-col items-center gap-4 text-center text-background"
          markClassName="size-14"
        />

        <p className="mt-6 max-w-xs text-center text-sm text-background/70">
          {church.tagline}. Una comunidad de fe en el corazón de{' '}
          {church.city}.
        </p>

        <div className="mt-10 grid w-full max-w-sm gap-3.5">
          {links.map((link) => {
            const Icon = LINK_ICONS[link.icon]
            const external = isExternal(link.url)
            return (
              <a
                key={link.title}
                href={link.url}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-3.5 rounded-full border border-background/20 bg-background/10 px-6 py-4 text-sm font-medium text-background backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{link.title}</span>
              </a>
            )
          })}

          {links.length === 0 && (
            <p className="text-center text-sm text-background/70">
              Muy pronto vas a encontrar todos nuestros enlaces aquí.
            </p>
          )}
        </div>

        <p className="mt-16 text-[11px] tracking-[0.2em] text-background/50 uppercase">
          {church.name} · {church.city}
        </p>
      </div>
    </div>
  )
}
