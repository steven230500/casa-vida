import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download, BookMarked } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { RelatedResources } from '@/components/resources/related'
import {
  resources,
  formatDate,
  resourceTypeLabels,
  type Resource,
} from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }))
}

function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) return {}
  return pageMetadata({
    title: resource.title,
    description: resource.summary,
    path: `/recursos/${resource.slug}`,
    image: resource.thumbnail,
  })
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resource = getResource(slug)
  if (!resource) notFound()

  return (
    <>
      <section className="border-t border-foreground/10 bg-background pt-32 pb-12 md:pt-44">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            <Link
              href="/recursos"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Recursos
            </Link>
          </Reveal>

          <div className="mt-8">
            <SectionLabel className="text-muted-foreground">
              {resourceTypeLabels[resource.type]}
              {resource.series ? ` · ${resource.series}` : ''}
            </SectionLabel>
            <h1 className="mt-5 text-[clamp(2rem,6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
              {resource.title}
            </h1>
            <p className="mt-5 text-muted-foreground">
              {resource.speaker} · {formatDate(resource.date)}
              {resource.duration ? ` · ${resource.duration}` : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background pb-16 md:pb-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <Reveal>
            {resource.youtubeId ? (
              <div className="aspect-video w-full overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10">
                <iframe
                  src={`https://www.youtube.com/embed/${resource.youtubeId}`}
                  title={resource.title}
                  allow="accelerate-compute; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            ) : (
              <ArchFrame
                src={resource.thumbnail}
                alt={resource.title}
                parallax={false}
                className="aspect-video w-full"
              />
            )}
          </Reveal>
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-12 px-5 md:grid-cols-3 md:px-8">
          <div className="md:col-span-2">
            <Reveal>
              <h2 className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Resumen
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                {resource.summary}
              </p>
              {resource.body && (
                <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                  {resource.body}
                </p>
              )}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="space-y-8">
            {resource.verses && resource.verses.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  <BookMarked className="size-4" />
                  Versículos citados
                </h2>
                <ul className="mt-4 space-y-2">
                  {resource.verses.map((v) => (
                    <li
                      key={v}
                      className="rounded-lg border border-foreground/10 bg-muted px-4 py-2.5 text-sm"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resource.notesUrl && (
              <div>
                <h2 className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Notas
                </h2>
                <a
                  href={resource.notesUrl}
                  download
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                >
                  <Download className="size-4" />
                  Descargar PDF
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <RelatedResources current={resource} all={resources} />
    </>
  )
}
