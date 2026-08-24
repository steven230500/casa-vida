'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

function parseValue(value: string) {
  if (!value) return { day: undefined, month: undefined, year: undefined }
  const [y, m, d] = value.split('-').map(Number)
  return { day: d, month: m, year: y }
}

// Native <input type="date"> opens on today's month/year, so picking a
// birth year decades back means clicking back one month at a time. Three
// plain dropdowns let you jump straight to any day/month/year instead.
//
// Day/month/year are kept as local state rather than derived straight from
// `value` on every render: while only some of the three are picked there's
// no valid ISO date to report yet, so an onChange('') round-trip through a
// controlled `value` prop would erase whichever parts were already picked.
// Pass a `key` from the parent (e.g. the record id, or 'new') so opening a
// different record still resets this to that record's own saved value.
export function BirthdatePicker({
  value,
  onChange,
}: {
  value: string // 'YYYY-MM-DD' or ''
  onChange: (value: string) => void
}) {
  const initial = parseValue(value)
  const [day, setDay] = useState(initial.day)
  const [month, setMonth] = useState(initial.month)
  const [year, setYear] = useState(initial.year)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i))
  const maxDay = month && year ? daysInMonth(month, year) : 31
  const days = Array.from({ length: maxDay }, (_, i) => String(i + 1))

  function pick(next: { day?: number; month?: number; year?: number }) {
    const d = next.day ?? day
    const m = next.month ?? month
    const y = next.year ?? year
    setDay(d)
    setMonth(m)
    setYear(y)
    if (d && m && y) {
      const clampedDay = Math.min(d, daysInMonth(m, y))
      onChange(
        `${y}-${String(m).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`,
      )
    } else {
      onChange('')
    }
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        value={day ? String(day) : undefined}
        onValueChange={(v) => pick({ day: Number(v) })}
      >
        <SelectTrigger className="w-full min-w-0">
          <SelectValue placeholder="Día" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {days.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month ? String(month) : undefined}
        onValueChange={(v) => pick({ month: Number(v) })}
      >
        <SelectTrigger className="w-full min-w-0">
          <SelectValue placeholder="Mes" className="truncate">
            {month ? MONTHS[month - 1] : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {MONTHS.map((label, i) => (
            <SelectItem key={label} value={String(i + 1)}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year ? String(year) : undefined}
        onValueChange={(v) => pick({ year: Number(v) })}
      >
        <SelectTrigger className="w-full min-w-0">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
