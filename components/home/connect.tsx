import { MessageCircle, ArrowUpRight } from 'lucide-react'
import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { InstagramIcon, YoutubeIcon } from '@/components/brand/social-icons'
import { socials, type Social } from '@/lib/data'

const icons: Record<Social['platform'], typeof MessageCircle> = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  whatsapp: MessageCircle,
}

export function Connect() {
  return (
    <section className="relative bg-foreground py-16 text-background md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionLabel number="07" className="text-background/50">
          Conéctate
        </SectionLabel>
        <h2 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <MaskedHeading lines={['Síguenos donde', 'ya estás']} />
        </h2>

        <div className="mt-12 flex flex-col">
          <div className="border-t border-background/15" />
          {socials.map((s, i) => {
            const Icon = icons[s.platform]
            return (
              <Reveal key={s.label} delay={i * 0.06}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-1 items-center gap-4 border-b border-background/15 py-7 md:grid-cols-12 md:gap-6 md:py-9"
                >
                  <div className="flex items-center gap-4 md:col-span-4">
                    <Icon className="size-6 text-beige" />
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                        {s.label}
                      </h3>
                      <p className="text-sm text-background/50">{s.handle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-background/60 md:col-span-6">
                    {s.description}
                  </p>
                  <div className="hidden justify-end md:col-span-2 md:flex">
                    <ArrowUpRight className="size-6 text-background/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-beige" />
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
