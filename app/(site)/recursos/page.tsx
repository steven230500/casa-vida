import type { Metadata } from 'next'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { PageHero } from '@/components/brand/page-hero'
import { Reveal } from '@/components/motion/reveal'
import { ArchButton } from '@/components/motion/magnetic'
import { YoutubeIcon } from '@/components/brand/social-icons'
import { sermons, youtubeChannel, formatDate } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Recursos',
  description:
    'Prédicas de Casa Vida. Míralas aquí o suscríbete al canal de YouTube para verlas todas.',
  path: '/recursos',
})

export default function RecursosPage() {
  return (
    <>
      <PageHero
        label="Recursos"
        lines={['Para toda', 'la semana']}
        description="Prédicas de Casa Vida para seguir creciendo entre domingo y domingo. Para el catálogo completo, visita nuestro canal de YouTube."
      />

      <section className="border-t border-foreground/10 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <a
                  href={`https://youtube.com/watch?v=${s.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={s.thumbnail}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-transform duration-500 group-hover:scale-110">
                        <Play className="size-5 translate-x-0.5 fill-current" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    <span>{s.series ?? s.topic}</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(s.date)}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.speaker}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-foreground py-16 text-background md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center md:px-8">
          <YoutubeIcon className="size-8 text-beige" />
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.02em]">
            ¿Quieres ver más?
          </h2>
          <p className="max-w-md text-background/70">
            Todas nuestras prédicas, series y transmisiones en vivo están en
            nuestro canal de YouTube.
          </p>
          <ArchButton href={youtubeChannel} variant="beige">
            Ver canal completo
          </ArchButton>
        </div>
      </section>
    </>
  )
}
