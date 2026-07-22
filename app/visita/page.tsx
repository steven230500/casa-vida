import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { WhatToExpect } from '@/components/visit/what-to-expect'
import { FirstVisitForm } from '@/components/forms/first-visit-form'
import { PrayerForm } from '@/components/forms/prayer-form'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Visita',
  description:
    'Planea tu primera visita a Casa Vida en Cartagena o envíanos tu petición de oración, incluso de forma anónima.',
  path: '/visita',
})

export default function VisitaPage() {
  return (
    <>
      <PageHero
        label="Visita"
        lines={['Ven como', 'estás']}
        description="No necesitas saber nada ni vestirte de ninguna forma en particular. Solo ven — aquí hay lugar para ti."
      />
      <WhatToExpect />

      <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionLabel number="02" className="text-muted-foreground">
            Planea tu visita
          </SectionLabel>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            <MaskedHeading lines={['Cuéntanos', 'que vienes']} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Nuestro equipo de bienvenida te estará esperando. Cuéntanos un
              poco de ti para hacer tu llegada más fácil.
            </p>
          </Reveal>
          <div className="mt-10">
            <FirstVisitForm />
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-foreground py-16 text-background md:py-28">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionLabel number="03" className="text-background/50">
            Oración
          </SectionLabel>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            <MaskedHeading lines={['Podemos orar', 'por ti']} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-background/60">
              Nuestro equipo de oración recibe cada petición con cuidado y
              confidencialidad. Si prefieres, puedes enviarla de forma
              anónima.
            </p>
          </Reveal>
          <div className="mt-10">
            <PrayerForm />
          </div>
        </div>
      </section>
    </>
  )
}
