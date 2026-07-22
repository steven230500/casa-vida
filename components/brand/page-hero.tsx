import { Reveal, MaskedHeading } from '@/components/motion/reveal'
import { SectionLabel } from '@/components/brand/section-label'
import { cn } from '@/lib/utils'

export function PageHero({
  label,
  lines,
  description,
  theme = 'light',
  className,
}: {
  label: string
  lines: string[]
  description?: string
  theme?: 'light' | 'dark'
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-20',
        theme === 'dark'
          ? 'bg-foreground text-background'
          : 'bg-background text-foreground',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel
            className={theme === 'dark' ? 'text-background/50' : 'text-muted-foreground'}
          >
            {label}
          </SectionLabel>
        </Reveal>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.75rem,8vw,6rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance">
          <MaskedHeading lines={lines} />
        </h1>
        {description && (
          <Reveal delay={0.15} className="mt-6 max-w-xl">
            <p
              className={cn(
                'text-lg leading-relaxed',
                theme === 'dark' ? 'text-background/70' : 'text-muted-foreground',
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
