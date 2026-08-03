import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { events as seedEvents, serviceTimes as seedServiceTimes } from '@/lib/data'
import type { ChurchEvent, ServiceTime } from '@/lib/data'

export type StoredEvent = ChurchEvent & { id: string }

type ContentStore = {
  events: StoredEvent[]
  serviceTimes: ServiceTime[]
}

const DATA_FILE =
  process.env.DATA_FILE_PATH ?? path.join(process.cwd(), 'data', 'content.json')

async function readStore(): Promise<ContentStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as ContentStore
  } catch {
    const seeded: ContentStore = {
      events: seedEvents.map((e) => ({ ...e, id: randomUUID() })),
      serviceTimes: seedServiceTimes,
    }
    await writeStore(seeded)
    return seeded
  }
}

async function writeStore(data: ContentStore) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function listEvents(): Promise<StoredEvent[]> {
  const store = await readStore()
  return [...store.events].sort((a, b) => a.date.localeCompare(b.date))
}

export async function createEvent(
  input: Omit<ChurchEvent, 'slug'> & { slug?: string },
): Promise<StoredEvent> {
  const store = await readStore()
  const slug =
    input.slug?.trim() ||
    input.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  const event: StoredEvent = { ...input, slug, id: randomUUID() }
  store.events.push(event)
  await writeStore(store)
  return event
}

export async function updateEvent(
  id: string,
  input: Partial<ChurchEvent>,
): Promise<StoredEvent | null> {
  const store = await readStore()
  const idx = store.events.findIndex((e) => e.id === id)
  if (idx === -1) return null
  store.events[idx] = { ...store.events[idx], ...input }
  await writeStore(store)
  return store.events[idx]
}

export async function deleteEvent(id: string): Promise<boolean> {
  const store = await readStore()
  const before = store.events.length
  store.events = store.events.filter((e) => e.id !== id)
  if (store.events.length === before) return false
  await writeStore(store)
  return true
}

export async function listServiceTimes(): Promise<ServiceTime[]> {
  const store = await readStore()
  return store.serviceTimes
}

export async function replaceServiceTimes(
  times: ServiceTime[],
): Promise<ServiceTime[]> {
  const store = await readStore()
  store.serviceTimes = times
  await writeStore(store)
  return times
}
