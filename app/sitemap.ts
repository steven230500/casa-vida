import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { ministries } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/nosotros',
    '/recursos',
    '/eventos',
    '/visita',
    '/ofrenda',
    '/cita',
    '/enlaces',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
  }))

  const ministryRoutes = ministries.map((m) => ({
    url: `${siteUrl}/ministerios/${m.slug}`,
  }))

  return [...staticRoutes, ...ministryRoutes]
}
