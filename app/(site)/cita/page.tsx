import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { BookingFlow } from '@/components/booking/booking-flow'
import { pageMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'Agenda una cita',
  description:
    'Agenda una cita pastoral con el equipo de Casa Vida en Cartagena. Elige un horario disponible y confirma en línea.',
  path: '/cita',
})

export default function CitaPage() {
  return (
    <>
      <PageHero
        label="Cita pastoral"
        lines={['Hablemos', 'en persona']}
        description="Agenda un espacio con nuestro equipo pastoral. Elige el día y la hora que mejor te quede."
      />
      <section className="border-t border-foreground/10 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <BookingFlow />
        </div>
      </section>
    </>
  )
}
