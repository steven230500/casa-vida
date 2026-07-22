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
import { marqueeWords } from '@/lib/data'
import { churchJsonLd } from '@/lib/seo'

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
      />
      <Hero />
      <Marquee items={marqueeWords} theme="beige" />
      <ServiceTimes />
      <About />
      <MinistriesGrid />
      <SermonsPreview />
      <EventsPreview />
      <Location />
      <Connect />
      <FinalCta />
    </>
  )
}
