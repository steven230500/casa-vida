import { PeopleManager } from '@/components/admin/people-manager'
import { listPeople } from '@/lib/people'

export const dynamic = 'force-dynamic'

export default async function AdminPersonasPage() {
  const people = await listPeople()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Personas</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Visitantes, nuevos y miembros de Casa Vida.
      </p>
      <div className="mt-8">
        <PeopleManager initialPeople={people} />
      </div>
    </div>
  )
}
