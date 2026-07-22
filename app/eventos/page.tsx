import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { EventsExplorer } from '@/components/events/events-explorer'
import { events } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Eventos',
  description:
    'Agenda de próximos eventos de Casa Vida en Cartagena: noches de adoración, retiros, jornadas de servicio y más.',
  path: '/eventos',
})

export default function EventosPage() {
  return (
    <>
      <PageHero
        label="Eventos"
        lines={['Cosas que', 'pasan aquí']}
        description="Lo que viene en Casa Vida: momentos para adorar, servir y hacer comunidad."
      />
      <section className="border-t border-foreground/10 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <EventsExplorer events={events} />
        </div>
      </section>
    </>
  )
}
