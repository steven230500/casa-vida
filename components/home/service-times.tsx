import { Reveal } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { serviceTimes } from '@/lib/data'

export function ServiceTimes() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel number="01" className="text-muted-foreground">
            Nos reunimos
          </SectionLabel>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {serviceTimes.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-beige p-8 text-beige-foreground transition-colors md:p-10">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-60">
                    {s.day}
                  </span>
                  <span className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-60">
                    {s.title}
                  </span>
                </div>
                <div className="mt-16 md:mt-24">
                  <p className="text-[clamp(2.5rem,7vw,5rem)] leading-none font-semibold tracking-[-0.03em]">
                    {s.time}
                  </p>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed opacity-70">
                    {s.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
