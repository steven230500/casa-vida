import { AvailabilityManager } from '@/components/admin/availability-manager'
import { AppointmentsList } from '@/components/admin/appointments-list'
import { listAvailability, listAppointments } from '@/lib/schedule'

export const dynamic = 'force-dynamic'

export default async function AdminAgendaPage() {
  const [availability, appointments] = await Promise.all([
    listAvailability(),
    listAppointments(),
  ])

  return (
    <div className="grid gap-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Disponibilidad
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Los bloques que marques aquí definen qué horarios ve la gente en{' '}
          <code className="text-xs">/cita</code> para agendar.
        </p>
        <div className="mt-8">
          <AvailabilityManager initialAvailability={availability} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Citas agendadas
        </h2>
        <div className="mt-8">
          <AppointmentsList initialAppointments={appointments} />
        </div>
      </div>
    </div>
  )
}
