import { EventsManager } from '@/components/admin/events-manager'
import { listEvents } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function AdminEventosPage() {
  const events = await listEvents()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Eventos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Crea, edita y elimina los eventos que aparecen en /eventos y en la
        vista previa del inicio.
      </p>
      <div className="mt-8">
        <EventsManager initialEvents={events} />
      </div>
    </div>
  )
}
