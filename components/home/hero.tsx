'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ArchButton } from '@/components/motion/magnetic'
import { ArchFrame } from '@/components/brand/arch-frame'
import { LogoMark } from '@/components/brand/logo'
import { church } from '@/lib/data'

export function Hero() {
  const reduce = useReducedMotion()

  const line = (text: string, delay: number) => (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduce ? { opacity: 0 } : { y: '110%' }}
        animate={reduce ? { opacity: 1 } : { y: '0%' }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  )

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto grid max-w-7xl items-end gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex items-center gap-3 text-[11px] font-medium tracking-[0.28em] uppercase text-muted-foreground"
          >
            <LogoMark className="size-5 text-foreground" strokeWidth={6} />
            Iglesia en {church.city}, {church.country}
          </motion.div>

          <h1 className="text-[clamp(3rem,11vw,8rem)] leading-[0.92] font-semibold tracking-[-0.04em] text-balance">
            {line('Bienvenido', 0.15)}
            {line('a casa', 0.28)}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            {church.tagline}. Una comunidad de fe sencilla y cercana en el
            corazón de Cartagena.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <ArchButton href="/visita" variant="dark">
              Planea tu visita
            </ArchButton>
            <ArchButton
              href="https://youtube.com/@casavidatv"
              variant="outline"
            >
              Ver en vivo
            </ArchButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5"
        >
          <ArchFrame
            src="/images/real-pastor.jpg"
            alt="Pastor de Casa Vida predicando en un servicio"
            priority
            parallax={false}
            className="aspect-[3/4] w-full"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </motion.div>
      </div>
    </section>
  )
}
