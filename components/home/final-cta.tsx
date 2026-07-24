import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { ArchButton } from '@/components/motion/magnetic'
import { LogoMark } from '@/components/brand/logo'
import { church } from '@/lib/data'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0">
        <Image
          src="/images/real-comunidad.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center md:py-36">
        <Reveal direction="none">
          <LogoMark className="size-12 text-beige" strokeWidth={5} />
        </Reveal>
        <h2 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
          <MaskedHeading lines={['Te esperamos', 'este domingo']} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-background/70">
            No necesitas vestirte de nada ni saber nada. Solo ven como estás —
            aquí hay lugar para ti.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ArchButton href="/visita" variant="beige">
              Planea tu visita
            </ArchButton>
            <ArchButton href="/dar" variant="outline">
              Dar una ofrenda
            </ArchButton>
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-10 inline-flex items-center gap-2 text-sm text-background/60">
            <MapPin className="size-4" />
            {church.address}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
