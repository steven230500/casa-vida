import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { timeline } from '@/lib/data'

export function History() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Reveal>
            <ArchFrame
              src="/images/about-1.png"
              alt="Fachada y balcones del barrio Manga, Cartagena"
              className="aspect-[3/4] w-full"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <SectionLabel number="01" className="text-muted-foreground">
            Nuestra historia
          </SectionLabel>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Casa Vida nació en 2012 en una sala de Manga, con un puñado de
              personas que creían que la fe se vive mejor cerca, sin
              pretensiones. Catorce años después seguimos siendo esa misma
              casa: más grande, pero con las puertas igual de abiertas.
            </p>
          </Reveal>

          <div className="mt-14 flex flex-col">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
                <div className="relative border-l border-foreground/10 pb-10 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-foreground" />
                  <span className="text-sm font-medium tabular-nums text-muted-foreground">
                    {t.year}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.01em]">
                    {t.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {t.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
