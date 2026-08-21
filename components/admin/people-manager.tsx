'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, X, Search, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar esta persona?')) return
    const res = await fetch(`/api/admin/people/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPeople((prev) => prev.filter((p) => p.id !== id))
    }
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

  // Scroll-shadow affordance: the table is wider than most viewports, so
  // without a visual cue it just looks cut off on the right instead of
  // scrollable. Fades appear/disappear as the container is scrolled.
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateScrollShadows() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollShadows()
    window.addEventListener('resize', updateScrollShadows)
    return () => window.removeEventListener('resize', updateScrollShadows)
  }, [filtered])

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

  return (
    <div>
      {!showForm && (
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
      )}

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8"
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
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
              <Label htmlFor="p-birthdate">Fecha de nacimiento</Label>
              <Input
                id="p-birthdate"
                type="date"
                value={form.birthdate}
                onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
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
      )}

      {!showForm && (
        <div className="relative mt-6 rounded-2xl border border-foreground/10">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
          )}
          <div
            ref={scrollRef}
            onScroll={updateScrollShadows}
            className="overflow-x-auto rounded-2xl"
          >
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-foreground/10 bg-muted text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="sticky left-0 z-[1] bg-muted px-4 py-3">Estado</th>
                <th className="sticky left-[92px] z-[1] bg-muted px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Barrio</th>
                <th className="px-4 py-3">Cuidador</th>
                <th className="px-4 py-3">Cumpleaños</th>
                {!readOnly && <th className="px-4 py-3 text-right">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={readOnly ? 7 : 8}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    {people.length === 0
                      ? 'No hay personas todavía.'
                      : 'Ninguna persona coincide con la búsqueda.'}
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-foreground/10 last:border-0 hover:bg-muted/40"
                >
                  <td className="sticky left-0 z-[1] bg-background px-4 py-3">
                    <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
                      {statusLabels[p.status]}
                    </span>
                  </td>
                  <td className="sticky left-[92px] z-[1] bg-background px-4 py-3 font-medium">
                    {p.fullName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.phone || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.neighborhood || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.caregiverName || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatBirthdate(p.birthdate)}
                  </td>
                  {!readOnly && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          aria-label="Editar"
                          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          <Pencil className="size-3.5" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
                          aria-label="Eliminar"
                          className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="border-t border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'persona' : 'personas'}
            {filtered.length !== people.length ? ` de ${people.length}` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
