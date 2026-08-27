'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { linkIconKeys, type Link } from '@/lib/data'
import { LINK_ICONS, LINK_ICON_LABELS } from '@/components/brand/link-icons'

const emptyRow: Link = {
  title: '',
  url: '',
  icon: 'instagram',
  active: true,
}

export function LinksEditor({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(index: number, field: keyof Link, value: string | boolean) {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)),
    )
    setSaved(false)
  }

  function addRow() {
    setLinks((prev) => [...prev, { ...emptyRow }])
    setSaved(false)
  }

  function removeRow(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  function move(index: number, direction: -1 | 1) {
    setLinks((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setSaved(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch('/api/admin/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links }),
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
      {links.map((l, i) => {
        const Icon = LINK_ICONS[l.icon]
        return (
          <div
            key={i}
            className={`grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 p-8 transition-opacity ${
              l.active ? 'bg-muted' : 'bg-muted/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <label className="flex w-fit items-center gap-2.5 text-sm">
                <Checkbox
                  checked={l.active}
                  onCheckedChange={(checked) => update(i, 'active', Boolean(checked))}
                />
                Visible en /enlaces
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Subir"
                  className="rounded-full border border-foreground/15 p-2 transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === links.length - 1}
                  aria-label="Bajar"
                  className="rounded-full border border-foreground/15 p-2 transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Eliminar enlace"
                  className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor={`link-title-${i}`}>Título</Label>
                <Input
                  id={`link-title-${i}`}
                  value={l.title}
                  onChange={(e) => update(i, 'title', e.target.value)}
                  placeholder="Ej: Síguenos en Instagram"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`link-url-${i}`}>Enlace (URL)</Label>
                <Input
                  id={`link-url-${i}`}
                  type="url"
                  value={l.url}
                  onChange={(e) => update(i, 'url', e.target.value)}
                  placeholder="https://instagram.com/casavidactg"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`link-icon-${i}`}>Ícono</Label>
                <Select
                  value={l.icon}
                  onValueChange={(v) => v && update(i, 'icon', v)}
                >
                  <SelectTrigger id={`link-icon-${i}`} className="w-full min-w-0">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <Icon className="size-4" />
                        {LINK_ICON_LABELS[l.icon]}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {linkIconKeys.map((key) => {
                      const OptionIcon = LINK_ICONS[key]
                      return (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            <OptionIcon className="size-4" />
                            {LINK_ICON_LABELS[key]}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Plus className="size-4" />
        Agregar enlace
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
