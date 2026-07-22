'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react'
import { type ChurchEvent } from '@/lib/data'

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function CalendarView({
  events,
  onRegister,
}: {
  events: ChurchEvent[]
  onRegister: (event: ChurchEvent) => void
}) {
  const [month, setMonth] = useState(() => startOfMonth(parseISO(events[0]?.date ?? new Date().toISOString())))
  const [selected, setSelected] = useState<ChurchEvent | null>(events[0] ?? null)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [month])

  function eventsOn(day: Date) {
    return events.filter((e) => isSameDay(parseISO(e.date), day))
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight capitalize">
          {format(month, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            aria-label="Mes anterior"
            className="flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Mes siguiente"
            className="flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-muted"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[11px] font-medium tracking-[0.15em] text-muted-foreground uppercase">
        {weekdays.map((d) => (
          <span key={d} className="py-2">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = eventsOn(day)
          const inMonth = isSameMonth(day, month)
          const hasEvent = dayEvents.length > 0
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!hasEvent}
              onClick={() => hasEvent && setSelected(dayEvents[0])}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition-colors ${
                inMonth ? 'text-foreground' : 'text-muted-foreground/40'
              } ${
                hasEvent
                  ? 'cursor-pointer bg-beige font-medium text-beige-foreground hover:bg-beige/70'
                  : 'cursor-default'
              } ${selected && hasEvent && isSameDay(parseISO(selected.date), day) ? 'ring-2 ring-foreground' : ''}`}
            >
              {format(day, 'd')}
              {hasEvent && <span className="size-1 rounded-full bg-foreground" />}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="mt-8 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-6 md:p-8">
          <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            {selected.category}
          </p>
          <h4 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
            {selected.title}
          </h4>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {selected.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {selected.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {selected.location}
            </span>
          </div>
          {selected.registration && (
            <button
              type="button"
              onClick={() => onRegister(selected)}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Registrarme
            </button>
          )}
        </div>
      )}
    </div>
  )
}
