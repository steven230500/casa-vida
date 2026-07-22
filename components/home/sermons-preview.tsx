import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { resources } from '@/lib/data'

export function SermonsPreview() {
  const sermons = resources.filter((r) => r.type === 'predica').slice(0, 3)

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <SectionLabel number="04" className="text-muted-foreground">
              Recursos
            </SectionLabel>
            <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-balance">
              Prédicas para toda la semana
            </h2>
          </div>
          <Link
            href="/recursos"
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase"
          >
            Ver todo
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sermons.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08}>
              <Link href={`/recursos/${s.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={s.thumbnail || '/placeholder.svg'}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-transform duration-500 group-hover:scale-110">
                      <Play className="size-5 translate-x-0.5 fill-current" />
                    </span>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  <span>{s.series}</span>
                  {s.duration && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{s.duration}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.speaker}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
