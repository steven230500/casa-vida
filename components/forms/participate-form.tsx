'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const schema = z.object({
  name: z.string().min(2, 'Cuéntanos tu nombre'),
  email: z.string().email('Ingresa un correo válido'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type Values = z.infer<typeof schema>

export function ParticipateForm({ ministryName }: { ministryName: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  async function onSubmit(_values: Values) {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('¡Recibimos tu mensaje! Te contactaremos pronto.')
    reset()
  }

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted px-8 py-16 text-center">
        <CheckCircle2 className="size-8" strokeWidth={1.5} />
        <p className="text-lg font-semibold tracking-tight">¡Listo!</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Tu solicitud para {ministryName.toLowerCase()} fue enviada. Muy
          pronto alguien del equipo te escribirá.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8 md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" placeholder="Tu nombre" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input id="phone" placeholder="300 000 0000" {...register('phone')} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Cuéntanos por qué quieres participar</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Opcional"
          {...register('message')}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando…' : 'Quiero participar'}
      </button>
    </form>
  )
}
