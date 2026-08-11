import { ServiceTimesEditor } from '@/components/admin/service-times-editor'
import { listServiceTimes } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function AdminHorariosPage() {
  const serviceTimes = await listServiceTimes()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Horarios</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estos horarios aparecen en la sección "Nos reunimos" del inicio y en
        el footer. Los que marques como ocultos no se muestran en el sitio,
        pero quedan guardados para reactivarlos cuando quieras.
      </p>
      <div className="mt-8">
        <ServiceTimesEditor initialServiceTimes={serviceTimes} />
      </div>
    </div>
  )
}
