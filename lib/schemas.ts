import { z } from 'zod'

export const firstVisitSchema = z.object({
  name: z.string().min(2, 'Cuéntanos tu nombre'),
  email: z.string().email('Ingresa un correo válido'),
  phone: z.string().optional(),
  service: z.enum(['domingo', 'jovenes']),
  kids: z.string().optional(),
  message: z.string().optional(),
})

export type FirstVisitValues = z.infer<typeof firstVisitSchema>

export const prayerSchema = z
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

export type PrayerValues = z.infer<typeof prayerSchema>
