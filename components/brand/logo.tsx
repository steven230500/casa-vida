import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('logo-mark size-8', className)}
    />
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
