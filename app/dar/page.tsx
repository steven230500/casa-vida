import type { Metadata } from 'next'
import { Landmark, Banknote, Smartphone } from 'lucide-react'
import { PageHero } from '@/components/brand/page-hero'
import { Transparency } from '@/components/giving/transparency'
import { BankCard } from '@/components/giving/bank-card'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { church } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Dar',
  description:
    'Formas de dar tu ofrenda a Casa Vida en Cartagena: transferencia bancaria, Bre-B o en efectivo durante el servicio.',
  path: '/dar',
})

const options = [
  {
    icon: Landmark,
    title: 'Transferencia bancaria',
    text: `Directo a nuestra cuenta en ${church.bank.name} — datos completos abajo.`,
  },
  {
    icon: Smartphone,
    title: 'Bre-B',
    text: `Paga al instante desde la app de tu banco con la llave ${church.bank.breBKey}.`,
  },
  {
    icon: Banknote,
    title: 'En efectivo',
    text: 'Durante cualquier servicio, en los puntos de ofrenda habilitados a la entrada.',
  },
]

export default function DarPage() {
  return (
    <>
      <PageHero
        label="Dar"
        lines={['Sembrar', 'en esta casa']}
        description="Dar es un acto de fe y de amor por la ciudad. Gracias por sostener lo que Dios está haciendo en Casa Vida."
      />

      <Transparency />

      <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionLabel number="02" className="text-muted-foreground">
            Cómo dar
          </SectionLabel>
          <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            <MaskedHeading lines={['Elige la forma', 'que prefieras']} />
          </h2>

          <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3">
            {options.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.1}>
                <o.icon className="size-6" strokeWidth={1.5} />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {o.text}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 max-w-2xl">
            <BankCard />
          </div>
        </div>
      </section>

      <p className="border-t border-foreground/10 bg-background px-5 py-8 text-center text-xs text-muted-foreground">
        ¿Tienes dudas sobre tu ofrenda?{' '}
        <a href={`mailto:${church.email}`} className="underline underline-offset-2">
          Escríbenos
        </a>
        .
      </p>
    </>
  )
}
