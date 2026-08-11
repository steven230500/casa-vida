'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
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
  notes: string
}

const emptyForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  birthdate: '',
  status: 'nuevo',
  notes: '',
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
  const filtered =
    filter === 'todos' ? people : people.filter((p) => p.status === filter)

  return (
    <div>
      {!showForm && (
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

          <div className="flex items-center gap-2">
            {(['todos', 'nuevo', 'visitante', 'miembro'] as const).map((f) => (
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
            ))}
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
        <div className="mt-8 flex flex-col">
          <div className="border-t border-foreground/10" />
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay personas todavía.
            </p>
          )}
          {filtered.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-1 items-center gap-4 border-b border-foreground/10 py-5 sm:grid-cols-12"
            >
              <div className="sm:col-span-2">
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
                  {statusLabels[p.status]}
                </span>
              </div>
              <div className="sm:col-span-6">
                <h3 className="font-semibold tracking-tight">{p.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {[p.email, p.phone].filter(Boolean).join(' · ') || '—'}
                </p>
              </div>
              {!readOnly && (
                <div className="flex gap-2 sm:col-span-4 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
