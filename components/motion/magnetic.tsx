'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Magnetic wrapper — the child drifts toward the cursor on desktop.
 * Falls back to a static element on touch / reduced-motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  function handleMove(e: React.MouseEvent<HTMLSpanElement>) {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.span>
  )
}

type ArchButtonProps = {
  href: string
  children: ReactNode
  variant?: 'dark' | 'light' | 'beige' | 'outline'
  className?: string
  magnetic?: boolean
}

const variants: Record<NonNullable<ArchButtonProps['variant']>, string> = {
  dark: 'bg-foreground text-background hover:bg-foreground/90',
  light: 'bg-background text-foreground hover:bg-background/90',
  beige: 'bg-beige text-beige-foreground hover:bg-beige/80',
  outline:
    'border border-current bg-transparent text-current hover:bg-current/5',
}

/**
 * Primary CTA — pill/arch-topped button with an animated arrow.
 */
export function ArchButton({
  href,
  children,
  variant = 'dark',
  className,
  magnetic = true,
}: ArchButtonProps) {
  const isExternal = href.startsWith('http')
  const Comp: any = isExternal ? 'a' : Link
  const props = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  const inner = (
    <Comp
      {...props}
      className={cn(
        'group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        variants[variant],
        className,
      )}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Comp>
  )

  if (!magnetic) return inner

  return (
    <>
      <Magnetic className="hidden md:inline-block">{inner}</Magnetic>
      <span className="md:hidden">{inner}</span>
    </>
  )
}
