import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { users, type Role } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth'

export type AdminUser = Omit<typeof users.$inferSelect, 'passwordHash'>

const columns = {
  id: users.id,
  email: users.email,
  fullName: users.fullName,
  role: users.role,
  pastorName: users.pastorName,
  createdAt: users.createdAt,
} as const

export async function listUsers(): Promise<AdminUser[]> {
  const db = getDb()
  return db.select(columns).from(users).orderBy(users.createdAt)
}

export async function createUser(input: {
  email: string
  password: string
  fullName: string
  role: Role
  pastorName?: string | null
}): Promise<AdminUser> {
  const db = getDb()
  const [row] = await db
    .insert(users)
    .values({
      email: input.email.trim().toLowerCase(),
      passwordHash: hashPassword(input.password),
      fullName: input.fullName,
      role: input.role,
      pastorName: input.role === 'pastor' ? (input.pastorName ?? null) : null,
    })
    .returning(columns)
  return row
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = getDb()
  const [row] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
  return Boolean(row)
}
