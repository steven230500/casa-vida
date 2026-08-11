'use client'

import { useMemo, useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  format,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function DatePickerCalendar({
  value,
  onChange,
}: {
  value: string
  onChange: (dateISO: string) => void
}) {
  const selected = parseISO(value)
  const [month, setMonth] = useState(() => startOfMonth(selected))
  const today = startOfToday()

  // Always 6 full weeks (42 days) so the card is the same height every
  // month - some months lay out in 5 rows and some in 6, which was making
  // the calendar (and everything below it) jump when you changed months.
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [month])

  return (
    <div className="w-full rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8 sm:w-96">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight capitalize">
          {format(month, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            aria-label="Mes anterior"
            disabled={isBefore(endOfMonth(subMonths(month, 1)), today)}
            className="flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Mes siguiente"
            className="flex size-9 items-center justify-center rounded-full border border-foreground/15 transition-colors hover:bg-background"
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
          const inMonth = isSameMonth(day, month)
          const isPast = isBefore(day, today)
          const isSelected = isSameDay(day, selected)
          const bookable = inMonth && !isPast
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={!bookable}
              onClick={() => bookable && onChange(format(day, 'yyyy-MM-dd'))}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors ${
                inMonth ? 'text-foreground' : 'text-muted-foreground/40'
              } ${
                bookable
                  ? 'cursor-pointer bg-beige font-medium text-beige-foreground hover:bg-beige/70'
                  : 'cursor-default'
              } ${isSelected ? 'ring-2 ring-foreground' : ''}`}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
