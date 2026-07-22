'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
})

type Values = z.infer<typeof schema>

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  async function onSubmit(_values: Values) {
    await new Promise((r) => setTimeout(r, 700))
    toast.success('¡Listo! Te escribiremos pronto.')
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex items-center gap-2 border-b border-background/25 pb-2 focus-within:border-beige">
        <label htmlFor="newsletter-email" className="sr-only">
          Correo electrónico
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="tu@correo.com"
          {...register('email')}
          className="w-full bg-transparent text-sm text-background placeholder:text-background/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Suscribirse"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-beige text-beige-foreground transition-transform hover:scale-105 disabled:opacity-60"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      {errors.email && (
        <p className="mt-2 text-xs text-beige">{errors.email.message}</p>
      )}
    </form>
  )
}
