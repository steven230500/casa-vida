'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { firstVisitSchema, type FirstVisitValues } from '@/lib/schemas'

export function FirstVisitForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FirstVisitValues>({
    resolver: zodResolver(firstVisitSchema),
    defaultValues: { service: 'domingo' },
  })

  async function onSubmit(values: FirstVisitValues) {
    const res = await fetch('/api/first-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      toast.error('No pudimos enviar tu solicitud. Intenta de nuevo.')
      return
    }

    setSent(true)
    toast.success('¡Nos vemos pronto! Te escribiremos para confirmar.')
    reset({ service: 'domingo' })
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted px-8 py-16 text-center">
        <CheckCircle2 className="size-8" strokeWidth={1.5} />
        <p className="text-lg font-semibold tracking-tight">¡Te esperamos!</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Recibimos tus datos. Nuestro equipo de bienvenida se pondrá en
          contacto contigo.
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
          <Label htmlFor="visit-name">Nombre</Label>
          <Input id="visit-name" placeholder="Tu nombre" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="visit-email">Correo</Label>
          <Input
            id="visit-email"
            type="email"
            placeholder="tu@correo.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="visit-phone">Teléfono (opcional)</Label>
          <Input id="visit-phone" placeholder="300 000 0000" {...register('phone')} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="visit-service">¿A cuál vienes?</Label>
          <Controller
            control={control}
            name="service"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="visit-service" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domingo">Servicio dominical · 10:00 a.m.</SelectItem>
                  <SelectItem value="jovenes">Jóvenes · sábados 5:00 p.m.</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="visit-kids">¿Vienes con niños? Edades (opcional)</Label>
        <Input id="visit-kids" placeholder="Ej. 4 y 7 años" {...register('kids')} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="visit-message">¿Algo que debamos saber? (opcional)</Label>
        <Textarea id="visit-message" rows={3} {...register('message')} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando…' : 'Planear mi visita'}
      </button>
    </form>
  )
}
