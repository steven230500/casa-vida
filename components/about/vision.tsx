import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { vision, mission } from '@/lib/data'

export function Vision() {
  return (
    <section className="border-t border-foreground/10 bg-foreground py-16 text-background md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-2 md:px-8">
        <div>
          <SectionLabel className="text-background/50">Visión</SectionLabel>
          <h2 className="mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
            <MaskedHeading lines={['Lo que vemos', 'por delante']} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/70">
              {vision}
            </p>
          </Reveal>
        </div>

        <div>
          <SectionLabel className="text-background/50">Misión</SectionLabel>
          <h2 className="mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
            <MaskedHeading lines={['Lo que hacemos', 'cada día']} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-background/70">
              {mission}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
