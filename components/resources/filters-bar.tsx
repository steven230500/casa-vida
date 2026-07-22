'use client'

import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortOrder = 'reciente' | 'antiguo'

export function FiltersBar({
  query,
  onQueryChange,
  series,
  seriesValue,
  onSeriesChange,
  topics,
  topicValue,
  onTopicChange,
  speakers,
  speakerValue,
  onSpeakerChange,
  sort,
  onSortChange,
}: {
  query: string
  onQueryChange: (value: string) => void
  series: string[]
  seriesValue: string
  onSeriesChange: (value: string) => void
  topics: string[]
  topicValue: string
  onTopicChange: (value: string) => void
  speakers: string[]
  speakerValue: string
  onSpeakerChange: (value: string) => void
  sort: SortOrder
  onSortChange: (value: SortOrder) => void
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por título, tema o predicador…"
          className="h-11 w-full rounded-full border border-foreground/15 bg-transparent pr-4 pl-10 text-sm placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={seriesValue}
          onValueChange={(v) => onSeriesChange(v as string)}
        >
          <SelectTrigger className="h-9 rounded-full px-4">
            <SelectValue placeholder="Serie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Toda serie</SelectItem>
            {series.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={topicValue}
          onValueChange={(v) => onTopicChange(v as string)}
        >
          <SelectTrigger className="h-9 rounded-full px-4">
            <SelectValue placeholder="Tema" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo tema</SelectItem>
            {topics.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={speakerValue}
          onValueChange={(v) => onSpeakerChange(v as string)}
        >
          <SelectTrigger className="h-9 rounded-full px-4">
            <SelectValue placeholder="Predicador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo predicador</SelectItem>
            {speakers.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => onSortChange(v as SortOrder)}
        >
          <SelectTrigger className="h-9 rounded-full px-4">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reciente">Más recientes</SelectItem>
            <SelectItem value="antiguo">Más antiguos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
