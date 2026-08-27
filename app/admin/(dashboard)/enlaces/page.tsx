import { LinksEditor } from '@/components/admin/links-editor'
import { listLinks } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function AdminEnlacesPage() {
  const links = await listLinks()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Enlaces</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estos enlaces aparecen en{' '}
        <span className="font-medium text-foreground">casavidactg.com/enlaces</span>
        , la página que podés poner en la biografía de Instagram y otras
        redes. Los que marques como ocultos quedan guardados pero no se
        muestran.
      </p>
      <div className="mt-8">
        <LinksEditor initialLinks={links} />
      </div>
    </div>
  )
}
