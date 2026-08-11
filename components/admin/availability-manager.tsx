'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Availability } from '@/lib/schedule'

const days = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
]

const dayLabel = (n: number) => days.find((d) => d.value === String(n))?.label ?? '—'

export function AvailabilityManager({
  initialAvailability,
}: {
  initialAvailability: Availability[]
}) {
  const [items, setItems] = useState(initialAvailability)
  const [pastorName, setPastorName] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('2')
  const [startTime, setStartTime] = useState('15:00')
  const [endTime, setEndTime] = useState('18:00')
  const [slotMinutes, setSlotMinutes] = useState('30')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch('/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pastorName,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        slotMinutes: Number(slotMinutes),
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'No se pudo guardar')
      setSaving(false)
      return
    }

    const { availability } = await res.json()
    setItems((prev) => [...prev, availability])
    setPastorName('')
    setSaving(false)
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar este bloque de disponibilidad?')) return
    const res = await fetch(`/api/admin/availability/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8 sm:grid-cols-5 sm:items-end"
      >
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="av-pastor">Pastor / líder</Label>
          <Input
            id="av-pastor"
            placeholder="Ps. Carlos Guardela"
            value={pastorName}
            onChange={(e) => setPastorName(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="av-day">Día</Label>
          <Select items={days} value={dayOfWeek} onValueChange={setDayOfWeek}>
            <SelectTrigger id="av-day" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="av-start">Desde</Label>
          <Input
            id="av-start"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="av-end">Hasta</Label>
          <Input
            id="av-end"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="av-slot">Duración de cada cita (minutos)</Label>
          <Input
            id="av-slot"
            type="number"
            min={5}
            step={5}
            value={slotMinutes}
            onChange={(e) => setSlotMinutes(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-3">
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            <Plus className="size-4" />
            {saving ? 'Guardando…' : 'Agregar bloque'}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col">
        <div className="border-t border-foreground/10" />
        {items.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No hay disponibilidad configurada todavía.
          </p>
        )}
        {items.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-4 border-b border-foreground/10 py-4"
          >
            <div>
              <p className="font-medium">
                {dayLabel(a.dayOfWeek)} · {a.startTime.slice(0, 5)}–
                {a.endTime.slice(0, 5)}
              </p>
              <p className="text-sm text-muted-foreground">
                {a.pastorName} · citas de {a.slotMinutes} min
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(a.id)}
              aria-label="Eliminar bloque"
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5" />
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
