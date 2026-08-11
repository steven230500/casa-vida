import {
  pgTable,
  uuid,
  text,
  date,
  time,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  date: text('date').notNull(), // stored as ISO date string, matches ChurchEvent.date
  time: text('time').notNull(),
  location: text('location').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  registration: boolean('registration').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const serviceTimes = pgTable('service_times', {
  id: uuid('id').primaryKey().defaultRandom(),
  day: text('day').notNull().unique(),
  time: text('time').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull().default(0),
})

export const peopleStatusValues = ['visitante', 'nuevo', 'miembro'] as const
export type PersonStatus = (typeof peopleStatusValues)[number]

export const people = pgTable('people', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  birthdate: date('birthdate'),
  status: text('status').$type<PersonStatus>().notNull().default('nuevo'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const pastorAvailability = pgTable('pastor_availability', {
  id: uuid('id').primaryKey().defaultRandom(),
  pastorName: text('pastor_name').notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday .. 6 = Saturday
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  slotMinutes: integer('slot_minutes').notNull().default(30),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const appointmentStatusValues = [
  'pendiente',
  'confirmada',
  'cancelada',
] as const
export type AppointmentStatus = (typeof appointmentStatusValues)[number]

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  availabilityId: uuid('availability_id').references(
    () => pastorAvailability.id,
    { onDelete: 'set null' },
  ),
  personId: uuid('person_id').references(() => people.id, {
    onDelete: 'set null',
  }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  date: date('date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  status: text('status')
    .$type<AppointmentStatus>()
    .notNull()
    .default('pendiente'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
