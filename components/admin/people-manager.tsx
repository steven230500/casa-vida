'use client'

import { Fragment, useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Download,
  ChevronDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BirthdatePicker } from '@/components/admin/birthdate-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Person } from '@/lib/people'
import type { PersonStatus } from '@/lib/db/schema'

const statusLabels: Record<PersonStatus, string> = {
  nuevo: 'Nuevo',
  visitante: 'Visitante',
  miembro: 'Miembro',
}

type FormState = {
  fullName: string
  email: string
  phone: string
  birthdate: string
  status: PersonStatus
  neighborhood: string
  caregiverName: string
  notes: string
}

const emptyForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  birthdate: '',
  status: 'nuevo',
  neighborhood: '',
  caregiverName: '',
  notes: '',
}

function formatBirthdate(value: string | null) {
  if (!value) return '—'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function PeopleManager({
  initialPeople,
  readOnly = false,
}: {
  initialPeople: Person[]
  readOnly?: boolean
}) {
  const [people, setPeople] = useState(initialPeople)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'todos' | PersonStatus>('todos')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Person | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  function startCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setCreating(true)
    setError(null)
  }

  function startEdit(person: Person) {
    setForm({
      fullName: person.fullName,
      email: person.email ?? '',
      phone: person.phone ?? '',
      birthdate: person.birthdate ?? '',
      status: person.status,
      neighborhood: person.neighborhood ?? '',
      caregiverName: person.caregiverName ?? '',
      notes: person.notes ?? '',
    })
    setEditingId(person.id)
    setCreating(false)
    setError(null)
  }

  function cancel() {
    setCreating(false)
    setEditingId(null)
    setError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch(
      editingId ? `/api/admin/people/${editingId}` : '/api/admin/people',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      },
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'No se pudo guardar')
      setSaving(false)
      return
    }

    const { person } = await res.json()
    setPeople((prev) =>
      editingId
        ? prev.map((p) => (p.id === editingId ? person : p))
        : [person, ...prev],
    )
    setSaving(false)
    setCreating(false)
    setEditingId(null)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    const res = await fetch(`/api/admin/people/${deleting.id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setPeople((prev) => prev.filter((p) => p.id !== deleting.id))
    }
    setDeleteBusy(false)
    setDeleting(null)
  }

  const showForm = creating || editingId !== null

  const filtered = useMemo(() => {
    const byStatus =
      filter === 'todos' ? people : people.filter((p) => p.status === filter)
    const q = query.trim().toLowerCase()
    if (!q) return byStatus
    return byStatus.filter((p) => {
      const haystack = [
        p.fullName,
        p.email,
        p.phone,
        p.neighborhood,
        p.caregiverName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [people, filter, query])

  async function onExport() {
    const XLSX = await import('xlsx')
    const rows = filtered.map((p) => ({
      Nombre: p.fullName,
      Estado: statusLabels[p.status],
      Correo: p.email ?? '',
      Teléfono: p.phone ?? '',
      'Fecha de nacimiento': p.birthdate ?? '',
      Barrio: p.neighborhood ?? '',
      Cuidador: p.caregiverName ?? '',
      Notas: p.notes ?? '',
    }))
    const sheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, sheet, 'Personas')
    const date = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `personas-casa-vida-${date}.xlsx`)
  }

  const detailFields = (p: Person) => [
    { label: 'Correo', value: p.email || '—' },
    { label: 'Teléfono', value: p.phone || '—' },
    { label: 'Fecha de nacimiento', value: formatBirthdate(p.birthdate) },
    { label: 'Barrio', value: p.neighborhood || '—' },
    { label: 'Cuidador', value: p.caregiverName || '—' },
    ...(p.notes ? [{ label: 'Notas', value: p.notes }] : []),
  ]

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {readOnly ? (
            <span className="text-sm text-muted-foreground">
              Modo de solo lectura
            </span>
          ) : (
            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <Plus className="size-4" />
              Nueva persona
            </button>
          )}

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-4" />
            Exportar Excel
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, correo, teléfono, barrio…"
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['todos', 'nuevo', 'visitante', 'miembro'] as const).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {f === 'todos' ? 'Todos' : statusLabels[f]}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-foreground/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-foreground/10 bg-muted text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="w-8 px-2 py-3" />
              <th className="px-2 py-3">Estado</th>
              <th className="px-4 py-3">Nombre</th>
              {!readOnly && <th className="px-4 py-3 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={readOnly ? 3 : 4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {people.length === 0
                    ? 'No hay personas todavía.'
                    : 'Ninguna persona coincide con la búsqueda.'}
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const isExpanded = expandedId === p.id
              return (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className="cursor-pointer border-b border-foreground/10 last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-2 py-3">
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
                        {statusLabels[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{p.fullName}</td>
                    {!readOnly && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEdit(p)
                            }}
                            aria-label="Editar"
                            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                          >
                            <Pencil className="size-3.5" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleting(p)
                            }}
                            aria-label="Eliminar"
                            className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-foreground/10 last:border-0 bg-muted/30">
                      <td colSpan={readOnly ? 3 : 4} className="px-6 py-4">
                        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {detailFields(p).map((f) => (
                            <div key={f.label}>
                              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {f.label}
                              </dt>
                              <dd className="mt-0.5 text-sm">{f.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        <p className="border-t border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'persona' : 'personas'}
          {filtered.length !== people.length ? ` de ${people.length}` : ''}
        </p>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={cancel}
        >
          <form
            onSubmit={onSubmit}
            onClick={(e) => e.stopPropagation()}
            className="grid h-full w-full gap-5 overflow-y-auto rounded-t-2xl border-t border-foreground/10 bg-muted p-6 sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:border sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {editingId ? 'Editar persona' : 'Nueva persona'}
              </h2>
              <button
                type="button"
                onClick={cancel}
                aria-label="Cancelar"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="p-name">Nombre completo</Label>
                <Input
                  id="p-name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-status">Estado</Label>
                <Select
                  items={[
                    { value: 'nuevo', label: 'Nuevo' },
                    { value: 'visitante', label: 'Visitante' },
                    { value: 'miembro', label: 'Miembro' },
                  ]}
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as PersonStatus })
                  }
                >
                  <SelectTrigger id="p-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="miembro">Miembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="p-email">Correo</Label>
                <Input
                  id="p-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-phone">Teléfono</Label>
                <Input
                  id="p-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de nacimiento</Label>
                <BirthdatePicker
                  key={editingId ?? 'new'}
                  value={form.birthdate}
                  onChange={(v) => setForm({ ...form, birthdate: v })}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="p-neighborhood">Barrio</Label>
                <Input
                  id="p-neighborhood"
                  value={form.neighborhood}
                  onChange={(e) =>
                    setForm({ ...form, neighborhood: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-caregiver">Cuidador (si es menor)</Label>
                <Input
                  id="p-caregiver"
                  value={form.caregiverName}
                  onChange={(e) =>
                    setForm({ ...form, caregiverName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-notes">Notas</Label>
              <Textarea
                id="p-notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => !deleteBusy && setDeleting(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-6"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              ¿Eliminar a {deleting.fullName}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={deleteBusy}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteBusy}
                className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-60"
              >
                <Trash2 className="size-3.5" />
                {deleteBusy ? 'Eliminando…' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
