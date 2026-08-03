'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ServiceTime } from '@/lib/data'

export function ServiceTimesEditor({
  initialServiceTimes,
}: {
  initialServiceTimes: ServiceTime[]
}) {
  const [times, setTimes] = useState(initialServiceTimes)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(index: number, field: keyof ServiceTime, value: string) {
    setTimes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    )
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
          className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8"
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor={`st-day-${i}`}>Día</Label>
              <Input
                id={`st-day-${i}`}
                value={t.day}
                onChange={(e) => update(i, 'day', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`st-time-${i}`}>Hora</Label>
              <Input
                id={`st-time-${i}`}
                value={t.time}
                onChange={(e) => update(i, 'time', e.target.value)}
                required
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
