'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { formatDate } from '@/lib/data'
import type { Appointment } from '@/lib/schedule'
import type { AppointmentStatus } from '@/lib/db/schema'

const statusStyles: Record<AppointmentStatus, string> = {
  pendiente: 'bg-beige text-beige-foreground',
  confirmada: 'bg-foreground text-background',
  cancelada: 'bg-destructive/10 text-destructive',
}

export function AppointmentsList({
  initialAppointments,
}: {
  initialAppointments: Appointment[]
}) {
  const [appointments, setAppointments] = useState(initialAppointments)

  async function setStatus(id: string, status: AppointmentStatus) {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const { appointment } = await res.json()
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? appointment : a)),
      )
    }
  }

  if (appointments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No hay citas agendadas todavía.
      </p>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="border-t border-foreground/10" />
      {appointments.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-1 items-center gap-4 border-b border-foreground/10 py-5 sm:grid-cols-12"
        >
          <div className="sm:col-span-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase ${statusStyles[a.status]}`}
            >
              {a.status}
            </span>
          </div>
          <div className="sm:col-span-5">
            <h3 className="font-semibold tracking-tight">{a.name}</h3>
            <p className="text-sm text-muted-foreground">
              {a.email} {a.phone ? `· ${a.phone}` : ''}
            </p>
          </div>
          <div className="text-sm text-muted-foreground sm:col-span-3">
            {formatDate(a.date)} · {a.startTime.slice(0, 5)}
          </div>
          <div className="flex gap-2 sm:col-span-2 sm:justify-end">
            {a.status !== 'confirmada' && (
              <button
                type="button"
                onClick={() => setStatus(a.id, 'confirmada')}
                aria-label="Confirmar"
                className="inline-flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-muted"
              >
                <Check className="size-4" />
              </button>
            )}
            {a.status !== 'cancelada' && (
              <button
                type="button"
                onClick={() => setStatus(a.id, 'cancelada')}
                aria-label="Cancelar"
                className="inline-flex size-9 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
