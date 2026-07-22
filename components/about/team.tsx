import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { ArchFrame } from '@/components/brand/arch-frame'
import { team } from '@/lib/data'

export function Team() {
  return (
    <section className="border-t border-foreground/10 bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionLabel number="03" className="text-muted-foreground">
          Equipo pastoral
        </SectionLabel>
        <h2 className="mt-6 max-w-2xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <MaskedHeading lines={['Personas que', 'caminan contigo']} />
        </h2>

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={(i % 3) * 0.08}>
              <ArchFrame
                src={member.image}
                alt={member.name}
                className="aspect-[3/4] w-full"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
