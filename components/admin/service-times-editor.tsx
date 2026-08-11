'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { ServiceTime } from '@/lib/data'
import { parseFriendlyTime, formatFriendlyTime } from '@/lib/time-format'

const emptyRow: ServiceTime = {
  day: '',
  time: '',
  title: '',
  description: '',
  active: true,
}

function TimeField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (friendly: string) => void
}) {
  const picked = parseFriendlyTime(value) ?? ''
  return (
    <Input
      id={id}
      type="time"
      value={picked}
      onChange={(e) => {
        if (e.target.value) onChange(formatFriendlyTime(e.target.value))
      }}
      required
    />
  )
}

export function ServiceTimesEditor({
  initialServiceTimes,
}: {
  initialServiceTimes: ServiceTime[]
}) {
  const [times, setTimes] = useState(initialServiceTimes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(index: number, field: keyof ServiceTime, value: string | boolean) {
    setTimes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    )
    setSaved(false)
  }

  function addRow() {
    setTimes((prev) => [...prev, { ...emptyRow }])
    setSaved(false)
  }

  function removeRow(index: number) {
    setTimes((prev) => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch('/api/admin/service-times', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceTimes: times }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'No se pudo guardar')
      setSaving(false)
      return
    }

    setSaving(false)
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      {times.map((t, i) => (
        <div
          key={i}
          className={`grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 p-8 transition-opacity ${
            t.active ? 'bg-muted' : 'bg-muted/40 opacity-60'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <label className="flex w-fit items-center gap-2.5 text-sm">
              <Checkbox
                checked={t.active}
                onCheckedChange={(checked) => update(i, 'active', Boolean(checked))}
              />
              Visible en el sitio
            </label>
            <button
              type="button"
              onClick={() => removeRow(i)}
              aria-label="Eliminar horario"
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Eliminar
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor={`st-day-${i}`}>Día</Label>
              <Input
                id={`st-day-${i}`}
                value={t.day}
                onChange={(e) => update(i, 'day', e.target.value)}
                placeholder="Ej: Miércoles"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`st-time-${i}`}>Hora</Label>
              <TimeField
                id={`st-time-${i}`}
                value={t.time}
                onChange={(friendly) => update(i, 'time', friendly)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`st-title-${i}`}>Título</Label>
              <Input
                id={`st-title-${i}`}
                value={t.title}
                onChange={(e) => update(i, 'title', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`st-desc-${i}`}>Descripción</Label>
            <Textarea
              id={`st-desc-${i}`}
              rows={2}
              value={t.description}
              onChange={(e) => update(i, 'description', e.target.value)}
              required
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Plus className="size-4" />
        Agregar horario
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
      >
        {saving ? 'Guardando…' : saved ? 'Guardado ✓' : 'Guardar cambios'}
      </button>
    </form>
  )
}
