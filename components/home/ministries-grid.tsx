import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { ministries } from '@/lib/data'

export function MinistriesGrid() {
  return (
    <section className="relative bg-foreground py-16 text-background md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel number="03" className="text-background/50">
              Ministerios
            </SectionLabel>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
              <MaskedHeading lines={['Hay un lugar', 'para ti']} />
            </h2>
          </div>
          <Reveal>
            <p className="max-w-sm text-background/60">
              Cada semana la vida de Casa Vida sucede en estos espacios. Encuentra
              dónde encajas.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 3) * 0.08}>
              <Link href={`/ministerios/${m.slug}`} className="group block">
                <ArchFrame
                  src={m.image}
                  alt={m.name}
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-sm text-background/55">{m.short}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 shrink-0 text-background/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-beige" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
