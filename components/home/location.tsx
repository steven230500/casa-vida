import { MapPin } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchButton } from '@/components/motion/magnetic'
import { church } from '@/lib/data'

const mapSrc = `https://www.google.com/maps?q=${church.mapsQuery.replace(/ /g, '+')}&z=16&output=embed`
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${church.mapsQuery.replace(/ /g, '+')}`

export function Location() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="flex flex-col justify-center md:col-span-5">
          <SectionLabel number="06" className="text-muted-foreground">
            Ubicación
          </SectionLabel>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
            <MaskedHeading lines={['Te esperamos', 'en Manga']} />
          </h2>

          <Reveal delay={0.1} className="mt-8 space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {church.address}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <ArchButton href={mapsHref} variant="dark">
              Cómo llegar
            </ArchButton>
          </Reveal>
        </div>

        <Reveal className="md:col-span-7" direction="none">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted md:aspect-[16/11]">
            <iframe
              src={mapSrc}
              title={`Mapa — ${church.name} en ${church.neighborhood}, ${church.city}`}
              loading="lazy"
              className="size-full grayscale"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
