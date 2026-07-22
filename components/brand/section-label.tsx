import { cn } from '@/lib/utils'

/**
 * Small numbered, uppercase, wide-tracked section label — e.g. "01 — NOSOTROS".
 */
export function SectionLabel({
  number,
  children,
  className,
}: {
  number?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.28em] uppercase',
        className,
      )}
    >
      {number && <span className="tabular-nums opacity-50">{number}</span>}
      {number && <span className="opacity-40">—</span>}
      <span>{children}</span>
    </span>
  )
}
