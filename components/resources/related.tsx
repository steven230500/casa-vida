import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { formatDate, resourceTypeLabels, type Resource } from '@/lib/data'

export function RelatedResources({
  current,
  all,
}: {
  current: Resource
  all: Resource[]
}) {
  const related = all
    .filter((r) => r.slug !== current.slug)
    .filter(
      (r) =>
        (current.series && r.series === current.series) ||
        r.type === current.type,
    )
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-foreground/10 bg-beige py-16 text-beige-foreground md:py-20">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionLabel className="opacity-60">Sigue explorando</SectionLabel>
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-3">
          {related.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.08}>
              <Link href={`/recursos/${r.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-background/40">
                  <Image
                    src={r.thumbnail || '/placeholder.svg'}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-[11px] font-medium tracking-[0.2em] uppercase opacity-60">
                  {resourceTypeLabels[r.type]} · {formatDate(r.date)}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.01em]">
                  {r.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
