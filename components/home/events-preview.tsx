import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { events, formatDate } from '@/lib/data'

export function EventsPreview() {
  const upcoming = events.slice(0, 3)

  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="05" className="text-muted-foreground">
              Agenda
            </SectionLabel>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
              Próximos eventos
            </h2>
          </div>
          <Link
            href="/eventos"
            className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase"
          >
            Ver agenda
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 flex flex-col">
          {upcoming.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.06}>
              <Link
                href={`/eventos#${e.slug}`}
                className="group grid grid-cols-1 items-center gap-4 border-t border-foreground/10 py-6 md:grid-cols-12 md:gap-6 md:py-8"
              >
                <div className="md:col-span-2">
                  <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    {e.category}
                  </span>
                </div>
                <div className="md:col-span-5">
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                    {e.title}
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground md:col-span-3">
                  <p>{formatDate(e.date)}</p>
                  <p>
                    {e.time} · {e.location}
                  </p>
                </div>
                <div className="relative hidden h-16 overflow-hidden rounded-xl bg-muted md:col-span-2 md:block">
                  <Image
                    src={e.image || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-foreground/10" />
        </div>
      </div>
    </section>
  )
}
