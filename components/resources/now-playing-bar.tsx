'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Play, Pause, X } from 'lucide-react'
import type { Resource } from '@/lib/data'

export function NowPlayingBar({
  resource,
  isOpen,
  onToggle,
  onClose,
}: {
  resource: Resource | null
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-background/10 bg-foreground text-background"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3.5 md:px-8">
            <button
              type="button"
              onClick={onToggle}
              aria-label={isOpen ? 'Pausar' : 'Reanudar'}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-beige text-beige-foreground transition-transform hover:scale-105"
            >
              {isOpen ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 translate-x-0.5 fill-current" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{resource.title}</p>
              <p className="truncate text-xs text-background/55">
                {resource.speaker}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar reproductor"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-background/60 transition-colors hover:bg-background/10 hover:text-background"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
