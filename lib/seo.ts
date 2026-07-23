import type { Metadata } from 'next'
import { church, serviceTimes } from '@/lib/data'

export const siteUrl = 'https://casavidactg.com'

const dayMap: Record<string, string> = {
  Domingos: 'Sunday',
  Sábados: 'Saturday',
}

export const churchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: church.name,
  url: siteUrl,
  image: `${siteUrl}/images/real-pastor.jpg`,
  telephone: church.phone,
  email: church.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: church.address,
    addressLocality: church.city,
    addressCountry: 'CO',
  },
  sameAs: [
    'https://instagram.com/casavidactg',
    'https://youtube.com/@casavidatv',
  ],
  openingHoursSpecification: serviceTimes
    .filter((s) => dayMap[s.day])
    .map((s) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[s.day],
      opens: to24h(s.time),
      description: s.title,
    })),
}

function to24h(time: string) {
  const match = time.match(/(\d+):(\d+)\s*(a\.m\.|p\.m\.)/i)
  if (!match) return time
  let [, h, m, period] = match
  let hour = parseInt(h, 10)
  if (/p\.m\./i.test(period) && hour !== 12) hour += 12
  if (/a\.m\./i.test(period) && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${m}`
}

export function pageMetadata({
  title,
  description,
  path,
  image = '/images/real-pastor.jpg',
}: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata {
  const url = `${siteUrl}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${church.name}`,
      description,
      url,
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${church.name}`,
      description,
      images: [image],
    },
  }
}
