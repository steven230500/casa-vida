import { Shirt, Clock, Baby } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'

const items = [
  {
    icon: Shirt,
    title: '¿Qué me pongo?',
    text: 'Ven como estás. Aquí no hay código de vestuario — la mayoría viene en ropa casual.',
  },
  {
    icon: Clock,
    title: '¿Cuánto dura?',
    text: 'El servicio dura aproximadamente una hora y quince minutos, con tiempo para saludarte al final.',
  },
  {
    icon: Baby,
    title: '¿Y los niños?',
    text: 'Tenemos un espacio seguro y divertido para niños de 2 a 11 años durante todo el servicio.',
  },
]

export function WhatToExpect() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionLabel number="01" className="text-muted-foreground">
          Qué esperar
        </SectionLabel>
        <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <MaskedHeading lines={['Tu primera vez', 'sin sorpresas']} />
        </h2>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <item.icon className="size-6" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
