import { cn } from '@/lib/utils'

/**
 * Casa Vida isotype — a minimalist line house: a body with a gable roof
 * and an arch (doorway) inside. The arch is the brand's signature shape.
 */
export function LogoMark({
  className,
  strokeWidth = 5,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn('size-8', className)}
    >
      {/* house outline with gable roof */}
      <path
        d="M14 46 L50 14 L86 46 M22 42 V86 H78 V42"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* arch doorway */}
      <path
        d="M39 86 V64 a11 11 0 0 1 22 0 V86"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string
  markClassName?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={cn('size-7', markClassName)} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-[0.28em] uppercase">
            Casa Vida
          </span>
          <span className="mt-1 text-[9px] font-medium tracking-[0.34em] uppercase opacity-60">
            Cartagena
          </span>
        </span>
      )}
    </span>
  )
}
