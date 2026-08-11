'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { DatePickerCalendar } from '@/components/booking/date-picker-calendar'

type Slot = { availabilityId: string; startTime: string; endTime: string }

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function BookingFlow() {
  const [date, setDate] = useState(todayISO())
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selected, setSelected] = useState<Slot | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setSelected(null)
    setLoadingSlots(true)
    fetch(`/api/slots?date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false))
  }, [date])

  async function book(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    setError(null)

    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        availabilityId: selected.availabilityId,
        name,
        email,
        phone: phone || undefined,
        notes: notes || undefined,
        date,
        startTime: selected.startTime,
        endTime: selected.endTime,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'No se pudo agendar tu cita')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted px-8 py-16 text-center">
        <CheckCircle2 className="size-8" strokeWidth={1.5} />
        <p className="text-lg font-semibold tracking-tight">¡Cita agendada!</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Te enviamos la confirmación a {email}. Te esperamos el {date} a las{' '}
          {selected?.startTime}.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
        <DatePickerCalendar value={date} onChange={setDate} />

        <div className="sm:pt-2">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Horarios disponibles
          </p>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay horarios disponibles ese día. Prueba con otra fecha.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {slots.map((s) => (
                <button
                  key={s.startTime}
                  type="button"
                  onClick={() => setSelected(s)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                    selected?.startTime === s.startTime
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-foreground/15 hover:bg-muted'
                  }`}
                >
                  <Clock className="size-3.5" />
                  {s.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <form
          onSubmit={book}
          className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cita-name">Nombre</Label>
              <Input
                id="cita-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cita-email">Correo</Label>
              <Input
                id="cita-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cita-phone">Teléfono (opcional)</Label>
            <Input
              id="cita-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cita-notes">¿Algo que debamos saber? (opcional)</Label>
            <Textarea
              id="cita-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            {submitting
              ? 'Agendando…'
              : `Confirmar cita · ${date} ${selected.startTime}`}
          </button>
        </form>
      )}
    </div>
  )
}
