import { HandHeart, Building2, Users2 } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'

const uses = [
  {
    icon: HandHeart,
    title: 'Fundación',
    text: 'Alimento, educación y acompañamiento para familias vulnerables de Cartagena a través de nuestra labor social.',
  },
  {
    icon: Users2,
    title: 'Ministerios',
    text: 'Jóvenes, niños, discipulado y todo lo que hace posible que cada semana haya un lugar para ti y tu familia.',
  },
  {
    icon: Building2,
    title: 'Operación',
    text: 'El espacio, el equipo y los recursos que sostienen a Casa Vida como una casa abierta cada semana.',
  },
]

export function Transparency() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionLabel number="01" className="text-muted-foreground">
          Transparencia
        </SectionLabel>
        <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <MaskedHeading lines={['¿A dónde va', 'tu ofrenda?']} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Cada ofrenda es administrada con cuidado por el equipo pastoral y
            financiero de Casa Vida, con un compromiso especial con nuestra
            Fundación y su labor social en la ciudad.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {uses.map((u, i) => (
            <Reveal key={u.title} delay={i * 0.1}>
              <u.icon className="size-6" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {u.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {u.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
