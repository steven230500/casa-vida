import { cn } from '@/lib/utils'

/**
 * Horizontal marquee of community keywords used as a section separator.
 */
export function Marquee({
  items,
  className,
  theme = 'beige',
  duration = 40,
}: {
  items: string[]
  className?: string
  theme?: 'beige' | 'dark' | 'light'
  duration?: number
}) {
  const themes = {
    beige: 'bg-beige text-beige-foreground',
    dark: 'bg-foreground text-background',
    light: 'bg-background text-foreground',
  }

  const loop = [...items, ...items]

  return (
    <div
      className={cn(
        'group relative flex overflow-hidden border-y border-current/10 py-5 select-none',
        themes[theme],
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="flex shrink-0 animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-2xl font-semibold tracking-tight md:text-4xl">
              {item}
            </span>
            <svg
              viewBox="0 0 100 100"
              className="size-4 shrink-0 opacity-50"
              aria-hidden="true"
            >
              <path
                d="M14 46 L50 14 L86 46 M22 42 V86 H78 V42 M39 86 V64 a11 11 0 0 1 22 0 V86"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}
