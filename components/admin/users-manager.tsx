'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AdminUser } from '@/lib/users'
import type { Role } from '@/lib/db/schema'

const roleLabels: Record<Role, string> = {
  admin: 'Admin',
  pastor: 'Pastor',
  servidor: 'Servidor',
}

const roleItems = [
  { value: 'servidor', label: 'Servidor (solo ve Personas)' },
  { value: 'pastor', label: 'Pastor (solo su Agenda)' },
  { value: 'admin', label: 'Admin (todo)' },
]

type FormState = {
  email: string
  password: string
  fullName: string
  role: Role
  pastorName: string
}

const emptyForm: FormState = {
  email: '',
  password: '',
  fullName: '',
  role: 'servidor',
  pastorName: '',
}

export function UsersManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startCreate() {
    setForm(emptyForm)
    setFormMode('create')
    setEditingId(null)
    setError(null)
  }

  function startEdit(user: AdminUser) {
    setForm({
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: user.role,
      pastorName: user.pastorName ?? '',
    })
    setFormMode('edit')
    setEditingId(user.id)
    setError(null)
  }

  function cancel() {
    setFormMode(null)
    setEditingId(null)
    setError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const isEdit = formMode === 'edit' && editingId
    const res = await fetch(
      isEdit ? `/api/admin/users/${editingId}` : '/api/admin/users',
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      },
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? (isEdit ? 'No se pudo actualizar' : 'No se pudo crear'))
      setSaving(false)
      return
    }

    const { user } = await res.json()
    setUsers((prev) =>
      isEdit ? prev.map((u) => (u.id === user.id ? user : u)) : [...prev, user],
    )
    setSaving(false)
    setFormMode(null)
    setEditingId(null)
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar este usuario? Pierde acceso al panel de inmediato.')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
    }
  }

  return (
    <div>
      {!formMode && (
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          <Plus className="size-4" />
          Nuevo usuario
        </button>
      )}

      {formMode && (
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-muted p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              {formMode === 'edit' ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancelar"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="u-name">Nombre completo</Label>
              <Input
                id="u-name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="u-email">Correo</Label>
              <Input
                id="u-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="u-password">
                {formMode === 'edit' ? 'Nueva contraseña' : 'Contraseña'}
              </Label>
              <Input
                id="u-password"
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={
                  formMode === 'edit'
                    ? 'Dejar en blanco para no cambiarla'
                    : 'Mínimo 8 caracteres'
                }
                required={formMode !== 'edit'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="u-role">Rol</Label>
              <Select
                items={roleItems}
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as Role })}
              >
                <SelectTrigger id="u-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.role === 'pastor' && (
            <div className="grid gap-2">
              <Label htmlFor="u-pastor-name">Nombre de pastor</Label>
              <Input
                id="u-pastor-name"
                value={form.pastorName}
                onChange={(e) => setForm({ ...form, pastorName: e.target.value })}
                placeholder="Ps. Carlos Guardela"
                required
              />
              <p className="text-xs text-muted-foreground">
                Debe coincidir exacto con el nombre que uses en su bloque de
                disponibilidad en Agenda.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-fit items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-60"
          >
            {formMode === 'edit'
              ? saving
                ? 'Guardando…'
                : 'Guardar cambios'
              : saving
                ? 'Creando…'
                : 'Crear usuario'}
          </button>
        </form>
      )}

      {!formMode && (
        <div className="mt-8 flex flex-col">
          <div className="border-t border-foreground/10" />
          {users.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay usuarios todavía.
            </p>
          )}
          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 items-center gap-4 border-b border-foreground/10 py-5 sm:grid-cols-12"
            >
              <div className="sm:col-span-2">
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium tracking-wide uppercase">
                  {roleLabels[u.role]}
                </span>
              </div>
              <div className="sm:col-span-7">
                <h3 className="font-semibold tracking-tight">{u.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {u.email}
                  {u.pastorName ? ` · ${u.pastorName}` : ''}
                </p>
              </div>
              <div className="flex gap-2 sm:col-span-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => startEdit(u)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  <Pencil className="size-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(u.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
