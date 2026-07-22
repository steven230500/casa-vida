import { Flame, Home, Heart } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { ArchButton } from '@/components/motion/magnetic'
import { values } from '@/lib/data'

const icons = { flame: Flame, home: Home, heart: Heart }

export function About() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Reveal>
            <ArchFrame
              src="/images/about-1.png"
              alt="Arquitectura y balcones del barrio Manga en Cartagena"
              className="aspect-[3/4] w-full"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Reveal>
        </div>

        <div className="flex flex-col justify-center md:col-span-7">
          <SectionLabel number="02" className="text-muted-foreground">
            Nosotros
          </SectionLabel>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
            <MaskedHeading
              lines={['No somos un edificio.', 'Somos una familia.']}
            />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Casa Vida nació de un grupo de personas reuniéndose en una sala.
              Hoy seguimos creyendo lo mismo: que la fe se vive mejor en
              comunidad, con las puertas abiertas y sin poses.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 border-t border-foreground/10 pt-10 sm:grid-cols-3">
            {values.map((v, i) => {
              const Icon = icons[v.icon as keyof typeof icons]
              return (
                <Reveal key={v.title} delay={i * 0.1}>
                  <div>
                    <Icon className="size-6" strokeWidth={1.5} />
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={0.1} className="mt-10">
            <ArchButton href="/nosotros" variant="dark">
              Conoce nuestra historia
            </ArchButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
