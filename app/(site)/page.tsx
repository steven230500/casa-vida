import { Hero } from '@/components/home/hero'
import { ServiceTimes } from '@/components/home/service-times'
import { About } from '@/components/home/about'
import { Marquee } from '@/components/brand/marquee'
import { MinistriesGrid } from '@/components/home/ministries-grid'
import { SermonsPreview } from '@/components/home/sermons-preview'
import { EventsPreview } from '@/components/home/events-preview'
import { Location } from '@/components/home/location'
import { Connect } from '@/components/home/connect'
import { FinalCta } from '@/components/home/final-cta'
import type { Metadata } from 'next'
import { marqueeWords } from '@/lib/data'
import { churchJsonLd, siteUrl } from '@/lib/seo'
import { listEvents, listActiveServiceTimes } from '@/lib/store'

export const dynamic = 'force-dynamic'

// Every other page gets its canonical from pageMetadata(); the home page
// defines its own title/description in the root layout, so it was the one
// page shipping without one - and www.casavidactg.com serves the same
// content on a second hostname, so Google had two uncanonicalised copies.
export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
}

export default async function HomePage() {
  const [events, serviceTimes] = await Promise.all([
    listEvents(),
    listActiveServiceTimes(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
      />
      <Hero />
      <Marquee items={marqueeWords} theme="beige" />
      <ServiceTimes serviceTimes={serviceTimes} />
      <About />
      <MinistriesGrid />
      <SermonsPreview />
      <EventsPreview events={events} serviceTimes={serviceTimes} />
      <Location />
      <Connect />
      <FinalCta />
    </>
  )
}
