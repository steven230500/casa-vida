import { UsersManager } from '@/components/admin/users-manager'
import { listUsers } from '@/lib/users'

export const dynamic = 'force-dynamic'

export default async function AdminUsuariosPage() {
  const users = await listUsers()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cuentas de acceso al panel. Pastor solo ve/edita su propia
        disponibilidad en Agenda; servidor solo ve Personas, sin editar.
      </p>
      <div className="mt-8">
        <UsersManager initialUsers={users} />
      </div>
    </div>
  )
}
