'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const schema = z
  .object({
    anonymous: z.boolean(),
    name: z.string().optional(),
    email: z.string().optional(),
    request: z.string().min(10, 'Cuéntanos un poco más sobre tu petición'),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['name'],
          message: 'Cuéntanos tu nombre',
        })
      }
      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: 'custom',
          path: ['email'],
          message: 'Ingresa un correo válido',
        })
      }
    }
  })

type Values = z.infer<typeof schema>

export function PrayerForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { anonymous: false },
  })

  const anonymous = watch('anonymous')

  async function onSubmit(_values: Values) {
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Recibimos tu petición. Oraremos por ti.')
    reset({ anonymous: false, name: '', email: '', request: '' })
  }

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-t-[2.5rem] rounded-b-2xl border border-background/15 bg-background/5 px-8 py-16 text-center">
        <CheckCircle2 className="size-8 text-beige" strokeWidth={1.5} />
        <p className="text-lg font-semibold tracking-tight">Estamos orando</p>
        <p className="max-w-xs text-sm text-background/60">
          Tu petición fue recibida por nuestro equipo de oración.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-background/15 bg-background/5 p-8 md:p-10"
    >
      {!anonymous && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="prayer-name" className="text-background/80">
              Nombre
            </Label>
            <Input
              id="prayer-name"
              placeholder="Tu nombre"
              className="border-background/25 text-background placeholder:text-background/40"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-beige">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prayer-email" className="text-background/80">
              Correo
            </Label>
            <Input
              id="prayer-email"
              type="email"
              placeholder="tu@correo.com"
              className="border-background/25 text-background placeholder:text-background/40"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-beige">{errors.email.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="prayer-request" className="text-background/80">
          Tu petición de oración
        </Label>
        <Textarea
          id="prayer-request"
          rows={4}
          placeholder="Cuéntanos cómo podemos orar por ti"
          className="border-background/25 text-background placeholder:text-background/40"
          {...register('request')}
        />
        {errors.request && (
          <p className="text-xs text-beige">{errors.request.message}</p>
        )}
      </div>

      <Controller
        control={control}
        name="anonymous"
        render={({ field }) => (
          <label className="group flex w-fit items-center gap-2.5 text-sm text-background/80">
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              className="border-background/30 data-checked:border-beige data-checked:bg-beige"
            />
            Enviar de forma anónima
          </label>
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center rounded-full bg-beige px-7 py-3.5 text-sm font-medium text-beige-foreground transition-colors hover:bg-beige/80 disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando…' : 'Enviar petición'}
      </button>
    </form>
  )
}
