import { eq, desc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { people, type PersonStatus } from '@/lib/db/schema'

export type Person = typeof people.$inferSelect

export type PersonInput = {
  fullName: string
  email?: string | null
  phone?: string | null
  birthdate?: string | null
  status: PersonStatus
  neighborhood?: string | null
  caregiverName?: string | null
  notes?: string | null
}

export async function listPeople(): Promise<Person[]> {
  const db = getDb()
  return db.select().from(people).orderBy(desc(people.createdAt))
}

export async function createPerson(input: PersonInput): Promise<Person> {
  const db = getDb()
  const [row] = await db.insert(people).values(input).returning()
  return row
}

export async function updatePerson(
  id: string,
  input: Partial<PersonInput>,
): Promise<Person | null> {
  const db = getDb()
  const [row] = await db
    .update(people)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(people.id, id))
    .returning()
  return row ?? null
}

export async function deletePerson(id: string): Promise<boolean> {
  const db = getDb()
  const [row] = await db
    .delete(people)
    .where(eq(people.id, id))
    .returning({ id: people.id })
  return Boolean(row)
}
