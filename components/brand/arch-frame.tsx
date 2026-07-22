'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Image framed in the Casa Vida arch shape, washed in black & white + beige
 * so photos from different sources feel cohesive. Optional gentle parallax.
 */
export function ArchFrame({
  src,
  alt,
  className,
  imageClassName,
  parallax = true,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  rounded = 'arch',
}: {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  parallax?: boolean
  priority?: boolean
  sizes?: string
  rounded?: 'arch' | 'top' | 'full'
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const radius =
    rounded === 'arch'
      ? 'arch'
      : rounded === 'top'
        ? 'rounded-t-[2.5rem]'
        : 'rounded-3xl'

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden bg-muted',
        radius,
        className,
      )}
    >
      <motion.div
        style={parallax && !reduce ? { y } : undefined}
        className="absolute inset-0 h-[116%] -top-[8%]"
      >
        <Image
          src={src || '/placeholder.svg'}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover grayscale', imageClassName)}
        />
      </motion.div>
      {/* beige wash for tonal cohesion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-beige mix-blend-multiply opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 to-transparent"
      />
    </div>
  )
}
