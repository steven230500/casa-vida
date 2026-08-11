import { eq, and, ne } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import {
  pastorAvailability,
  appointments,
  type AppointmentStatus,
} from '@/lib/db/schema'

export type Availability = typeof pastorAvailability.$inferSelect
export type Appointment = typeof appointments.$inferSelect

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (totalMinutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

export async function listAvailability(pastorName?: string): Promise<Availability[]> {
  const db = getDb()
  const query = db.select().from(pastorAvailability)
  if (pastorName) {
    return query.where(eq(pastorAvailability.pastorName, pastorName))
  }
  return query
}

/** For ownership checks before a pastor edits/deletes a block that isn't theirs. */
export async function getAvailabilityPastorName(id: string): Promise<string | null> {
  const db = getDb()
  const [row] = await db
    .select({ pastorName: pastorAvailability.pastorName })
    .from(pastorAvailability)
    .where(eq(pastorAvailability.id, id))
    .limit(1)
  return row?.pastorName ?? null
}

export async function createAvailability(input: {
  pastorName: string
  dayOfWeek: number
  startTime: string
  endTime: string
  slotMinutes: number
}): Promise<Availability> {
  const db = getDb()
  const [row] = await db.insert(pastorAvailability).values(input).returning()
  return row
}

export async function deleteAvailability(id: string): Promise<boolean> {
  const db = getDb()
  const [row] = await db
    .delete(pastorAvailability)
    .where(eq(pastorAvailability.id, id))
    .returning({ id: pastorAvailability.id })
  return Boolean(row)
}

/** Open slots for a given ISO date (YYYY-MM-DD), derived from recurring
 * weekly availability minus whatever's already booked that day. */
export async function getAvailableSlots(
  dateISO: string,
): Promise<{ availabilityId: string; startTime: string; endTime: string }[]> {
  const db = getDb()
  const dayOfWeek = new Date(`${dateISO}T00:00:00`).getDay()

  const windows = await db
    .select()
    .from(pastorAvailability)
    .where(
      and(
        eq(pastorAvailability.dayOfWeek, dayOfWeek),
        eq(pastorAvailability.active, true),
      ),
    )

  const booked = await db
    .select({ startTime: appointments.startTime })
    .from(appointments)
    .where(
      and(eq(appointments.date, dateISO), ne(appointments.status, 'cancelada')),
    )
  const bookedTimes = new Set(booked.map((b) => b.startTime.slice(0, 5)))

  const seen = new Set<string>()
  const slots: { availabilityId: string; startTime: string; endTime: string }[] = []

  for (const w of windows) {
    const start = toMinutes(w.startTime.slice(0, 5))
    const end = toMinutes(w.endTime.slice(0, 5))
    for (let t = start; t + w.slotMinutes <= end; t += w.slotMinutes) {
      const startTime = toHHMM(t)
      if (bookedTimes.has(startTime) || seen.has(startTime)) continue
      seen.add(startTime)
      slots.push({
        availabilityId: w.id,
        startTime,
        endTime: toHHMM(t + w.slotMinutes),
      })
    }
  }

  return slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export async function createAppointment(input: {
  availabilityId: string
  personId?: string | null
  name: string
  email: string
  phone?: string | null
  date: string
  startTime: string
  endTime: string
  notes?: string | null
}): Promise<Appointment | null> {
  const db = getDb()

  // Re-check the slot is still free right before booking (closes the race
  // between "loaded the slot list" and "clicked book").
  const clash = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.date, input.date),
        eq(appointments.startTime, input.startTime),
        ne(appointments.status, 'cancelada'),
      ),
    )
    .limit(1)
  if (clash.length > 0) return null

  const [row] = await db.insert(appointments).values(input).returning()
  return row
}

export async function listAppointments(pastorName?: string): Promise<Appointment[]> {
  const db = getDb()
  if (pastorName) {
    const rows = await db
      .select({ appointment: appointments })
      .from(appointments)
      .innerJoin(
        pastorAvailability,
        eq(appointments.availabilityId, pastorAvailability.id),
      )
      .where(eq(pastorAvailability.pastorName, pastorName))
      .orderBy(appointments.date, appointments.startTime)
    return rows.map((r) => r.appointment)
  }
  return db.select().from(appointments).orderBy(appointments.date, appointments.startTime)
}

/** For ownership checks before a pastor updates an appointment that isn't theirs. */
export async function getAppointmentPastorName(id: string): Promise<string | null> {
  const db = getDb()
  const [row] = await db
    .select({ pastorName: pastorAvailability.pastorName })
    .from(appointments)
    .innerJoin(
      pastorAvailability,
      eq(appointments.availabilityId, pastorAvailability.id),
    )
    .where(eq(appointments.id, id))
    .limit(1)
  return row?.pastorName ?? null
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment | null> {
  const db = getDb()
  const [row] = await db
    .update(appointments)
    .set({ status })
    .where(eq(appointments.id, id))
    .returning()
  return row ?? null
}
