import { eq, like, asc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import {
  events as eventsTable,
  serviceTimes as serviceTimesTable,
  links as linksTable,
} from '@/lib/db/schema'
import { serviceTimes as seedServiceTimes } from '@/lib/data'
import type { ChurchEvent, ServiceTime, Link } from '@/lib/data'

export type StoredEvent = ChurchEvent & { id: string }

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Uses onConflictDoNothing (keyed on the unique day column) instead of a
// check-then-insert, so concurrent cold-start requests can't race and double-seed.
// Events have no placeholder data to seed - real ones only come from admin.
async function ensureServiceTimesSeeded() {
  const db = getDb()
  await db
    .insert(serviceTimesTable)
    .values(seedServiceTimes.map((s, i) => ({ ...s, order: i })))
    .onConflictDoNothing()
}

export async function listEvents(): Promise<StoredEvent[]> {
  const db = getDb()
  const rows = await db.select().from(eventsTable)
  return rows.sort((a, b) => a.date.localeCompare(b.date))
}

export async function createEvent(
  input: Omit<ChurchEvent, 'slug'> & { slug?: string },
): Promise<StoredEvent> {
  const db = getDb()
  const base = input.slug?.trim() || slugify(input.title)
  const taken = new Set(
    (
      await db
        .select({ slug: eventsTable.slug })
        .from(eventsTable)
        .where(like(eventsTable.slug, `${base}%`))
    ).map((r) => r.slug),
  )
  let slug = base
  let n = 2
  while (taken.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  const [row] = await db
    .insert(eventsTable)
    .values({ ...input, slug })
    .returning()
  return row
}

export async function updateEvent(
  id: string,
  input: Partial<ChurchEvent>,
): Promise<StoredEvent | null> {
  const db = getDb()
  const [row] = await db
    .update(eventsTable)
    .set(input)
    .where(eq(eventsTable.id, id))
    .returning()
  return row ?? null
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = getDb()
  const [row] = await db
    .delete(eventsTable)
    .where(eq(eventsTable.id, id))
    .returning({ id: eventsTable.id })
  return Boolean(row)
}

// For admin - includes hidden (inactive) rows, so they can be toggled back on.
export async function listServiceTimes(): Promise<ServiceTime[]> {
  await ensureServiceTimesSeeded()
  const db = getDb()
  return db.select().from(serviceTimesTable).orderBy(asc(serviceTimesTable.order))
}

// For the public site - only what staff has marked visible.
export async function listActiveServiceTimes(): Promise<ServiceTime[]> {
  const all = await listServiceTimes()
  return all.filter((t) => t.active)
}

export async function replaceServiceTimes(
  times: ServiceTime[],
): Promise<ServiceTime[]> {
  const db = getDb()
  await db.delete(serviceTimesTable)
  await db
    .insert(serviceTimesTable)
    .values(times.map((t, i) => ({ ...t, order: i })))
  return times
}

export async function listLinks(): Promise<Link[]> {
  const db = getDb()
  return db.select().from(linksTable).orderBy(asc(linksTable.order))
}

// For the public /enlaces page - only what staff has marked visible.
export async function listActiveLinks(): Promise<Link[]> {
  const all = await listLinks()
  return all.filter((l) => l.active)
}

export async function replaceLinks(links: Link[]): Promise<Link[]> {
  const db = getDb()
  await db.delete(linksTable)
  if (links.length > 0) {
    await db.insert(linksTable).values(links.map((l, i) => ({ ...l, order: i })))
  }
  return links
}
