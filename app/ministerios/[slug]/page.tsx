import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Users } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { ParticipateForm } from '@/components/forms/participate-form'
import { ministries, type Ministry } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return ministries.map((m) => ({ slug: m.slug }))
}

function getMinistry(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ministry = getMinistry(slug)
  if (!ministry) return {}
  return pageMetadata({
    title: ministry.name,
    description: ministry.description,
    path: `/ministerios/${ministry.slug}`,
    image: ministry.image,
  })
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ministry = getMinistry(slug)
  if (!ministry) notFound()

  return (
    <>
      <section className="relative overflow-hidden border-t border-foreground/10 bg-background pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-5 md:grid-cols-12 md:px-8">
          <div className="md:col-span-7">
            <Reveal>
              <Link
                href="/nosotros"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Ministerios
              </Link>
            </Reveal>
            <SectionLabel className="mt-8 text-muted-foreground">
              Ministerio
            </SectionLabel>
            <h1 className="mt-6 text-[clamp(2.75rem,8vw,6rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
              <MaskedHeading lines={ministry.name.split(' ')} />
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {ministry.description}
              </p>
            </Reveal>
          </div>

          <Reveal className="md:col-span-5" direction="none">
            <ArchFrame
              src={ministry.image}
              alt={ministry.name}
              priority
              className="aspect-[4/5] w-full"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-beige py-14 text-beige-foreground">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <Reveal className="flex items-start gap-4">
              <Calendar className="mt-1 size-6 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-60">
                  Horario
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {ministry.schedule}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="flex items-start gap-4">
              <Users className="mt-1 size-6 shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-60">
                  Para quién es
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {ministry.audience}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {ministry.gallery.length > 0 && (
        <section className="border-t border-foreground/10 bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionLabel className="text-muted-foreground">
              Galería
            </SectionLabel>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {ministry.gallery.map((src, i) => (
                <Reveal key={src} delay={i * 0.1}>
                  <ArchFrame
                    src={src}
                    alt={`${ministry.name} — foto ${i + 1}`}
                    className="aspect-[4/3] w-full"
                    rounded="top"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-foreground/10 bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionLabel className="text-muted-foreground">
            Súmate
          </SectionLabel>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
            <MaskedHeading lines={['Quiero', 'participar']} />
          </h2>
          <div className="mt-10">
            <ParticipateForm ministryName={ministry.name} />
          </div>
        </div>
      </section>
    </>
  )
}
