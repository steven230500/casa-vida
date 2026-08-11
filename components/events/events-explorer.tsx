'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Clock, CalendarDays } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Reveal } from '@/components/motion/reveal'
import { CalendarView } from '@/components/events/calendar-view'
import { RegisterDialog } from '@/components/events/register-dialog'
import { formatDate, type ChurchEvent } from '@/lib/data'

export function EventsExplorer({ events }: { events: ChurchEvent[] }) {
  const [registering, setRegistering] = useState<ChurchEvent | null>(null)

  if (events.length === 0) {
    return (
      <Reveal>
        <div className="flex flex-col items-center overflow-hidden rounded-t-[2.5rem] rounded-b-2xl border border-foreground/10 bg-beige px-8 py-20 text-center text-beige-foreground md:py-28">
          <div className="flex size-14 items-center justify-center rounded-full bg-beige-foreground/10">
            <CalendarDays className="size-6" />
          </div>
          <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            Todavía no hay eventos agendados
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-beige-foreground/70">
            Estamos preparando lo que viene. Vuelve pronto o síguenos en
            redes para enterarte apenas se abra un nuevo evento.
          </p>
        </div>
      </Reveal>
    )
  }

  return (
    <div>
      <Tabs defaultValue="lista">
        <TabsList variant="line" className="border-b border-foreground/10 pb-0">
          <TabsTrigger value="lista" className="px-4 py-3 text-sm">
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="px-4 py-3 text-sm">
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-10">
          <div className="flex flex-col">
            <div className="border-t border-foreground/10" />
            {events.map((e, i) => (
              <Reveal key={e.slug} delay={i * 0.06}>
                <div
                  id={e.slug}
                  className="grid scroll-mt-28 grid-cols-1 items-center gap-6 border-b border-foreground/10 py-8 md:grid-cols-12"
                >
                  <div className="relative hidden aspect-square overflow-hidden rounded-2xl bg-muted md:col-span-2 md:block">
                    <Image
                      src={e.image || '/placeholder.svg'}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="md:col-span-7">
                    <span className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                      {e.category}
                    </span>
                    <h3 className="mt-1 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                      {e.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span>{formatDate(e.date)}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {e.time}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {e.location}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    {e.registration && (
                      <button
                        type="button"
                        onClick={() => setRegistering(e)}
                        className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                      >
                        Registrarme
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendario" className="mt-10 max-w-2xl">
          <CalendarView events={events} onRegister={setRegistering} />
        </TabsContent>
      </Tabs>

      {registering && (
        <RegisterDialog
          event={registering}
          open={Boolean(registering)}
          onOpenChange={(open) => !open && setRegistering(null)}
        />
      )}
    </div>
  )
}
