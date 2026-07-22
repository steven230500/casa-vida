import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { NewsletterForm } from '@/components/forms/newsletter-form'
import { church, nav, serviceTimes, socials } from '@/lib/data'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo className="text-background" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-background/60">
              Una comunidad de fe en el corazón de Cartagena. {church.tagline}.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-medium tracking-[0.28em] text-background/50 uppercase">
              Navegación
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/80 transition-colors hover:text-beige"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-medium tracking-[0.28em] text-background/50 uppercase">
              Horarios
            </h3>
            <ul className="mt-5 space-y-4">
              {serviceTimes.map((s) => (
                <li key={s.title} className="text-sm">
                  <p className="font-medium">{s.day}</p>
                  <p className="text-background/60">
                    {s.time} · {s.title}
                  </p>
                </li>
              ))}
            </ul>
            <h3 className="mt-8 text-[11px] font-medium tracking-[0.28em] text-background/50 uppercase">
              Dónde estamos
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-background/70">
              {church.address}
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-medium tracking-[0.28em] text-background/50 uppercase">
              Recibe novedades
            </h3>
            <p className="mt-4 text-sm text-background/60">
              Suscríbete y entérate de los servicios y eventos de la semana.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-background/80 transition-colors hover:text-beige"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-background/10 pt-8 text-xs text-background/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {church.name} · {church.city},{' '}
            {church.country}
          </p>
          <p>Hecho con fe en Cartagena.</p>
        </div>
      </div>
    </footer>
  )
}
