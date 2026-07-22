'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate, type ChurchEvent } from '@/lib/data'

const schema = z.object({
  name: z.string().min(2, 'Cuéntanos tu nombre'),
  email: z.string().email('Ingresa un correo válido'),
  guests: z.string().optional(),
})

type Values = z.infer<typeof schema>

export function RegisterDialog({
  event,
  open,
  onOpenChange,
}: {
  event: ChurchEvent
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  async function onSubmit(_values: Values) {
    await new Promise((r) => setTimeout(r, 800))
    toast.success(`¡Listo! Te esperamos en "${event.title}".`)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{event.title}</DialogTitle>
          <DialogDescription>
            {formatDate(event.date)} · {event.time} · {event.location}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="reg-name">Nombre</Label>
            <Input id="reg-name" placeholder="Tu nombre" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reg-email">Correo</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="tu@correo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reg-guests">Acompañantes (opcional)</Label>
            <Input id="reg-guests" placeholder="0" {...register('guests')} />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            {isSubmitting ? 'Enviando…' : 'Confirmar registro'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
