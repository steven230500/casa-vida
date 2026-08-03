'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/data'
import type { StoredEvent } from '@/lib/store'

type FormState = {
  title: string
  date: string
  time: string
  location: string
  category: string
  description: string
  image: string
  registration: boolean
}

const emptyForm: FormState = {
  title: '',
  date: '',
  time: '',
  location: '',
  category: '',
  description: '',
  image: '',
  registration: true,
}

export function EventsManager({
  initialEvents,
}: {
  initialEvents: StoredEvent[]
}) {
  const [events, setEvents] = useState(initialEvents)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setCreating(true)
    setError(null)
  }

  function startEdit(event: StoredEvent) {
    setForm({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      description: event.description,
      image: event.image,
      registration: event.registration,
    })
    setEditingId(event.id)
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
      editingId ? `/api/admin/events/${editingId}` : '/api/admin/events',
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

    const { event } = await res.json()
    setEvents((prev) =>
      editingId
        ? prev.map((ev) => (ev.id === editingId ? event : ev))
        : [...prev, event].sort((a, b) => a.date.localeCompare(b.date)),
    )
    setSaving(false)
    setCreating(false)
    setEditingId(null)
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar este evento?')) return
    const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id))
    }
  }

  const showForm = creating || editingId !== null

  return (
    <div>
      {!showForm && (
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Nuevo evento
        </button>
      )}

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              {editingId ? 'Editar evento' : 'Nuevo evento'}
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
              <Label htmlFor="ev-title">Título</Label>
              <Input
                id="ev-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-category">Categoría</Label>
              <Input
                id="ev-category"
                placeholder="Adoración, Jóvenes, Servicio…"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="ev-date">Fecha</Label>
              <Input
                id="ev-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-time">Hora</Label>
              <Input
                id="ev-time"
                placeholder="7:00 p.m."
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ev-location">Lugar</Label>
              <Input
                id="ev-location"
                placeholder="Casa Vida · Manga"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ev-description">Descripción</Label>
            <Textarea
              id="ev-description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ev-image">Imagen (ruta o URL)</Label>
            <Input
              id="ev-image"
              placeholder="/images/event-worship.png"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
          </div>

          <label className="flex w-fit items-center gap-2.5 text-sm">
            <Checkbox
              checked={form.registration}
              onCheckedChange={(checked) =>
                setForm({ ...form, registration: Boolean(checked) })
              }
            />
            Permite registro
          </label>

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
          {events.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay eventos todavía.
            </p>
          )}
          {events.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-1 items-center gap-4 border-b border-foreground/10 py-6 sm:grid-cols-12"
            >
              <div className="sm:col-span-2">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  {e.category}
                </span>
              </div>
              <div className="sm:col-span-5">
                <h3 className="font-semibold tracking-tight">{e.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(e.date)} · {e.time} · {e.location}
                </p>
              </div>
              <div className="flex gap-2 sm:col-span-5 sm:justify-end">
                <button
                  type="button"
                  onClick={() => startEdit(e)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Pencil className="size-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(e.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
