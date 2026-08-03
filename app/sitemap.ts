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
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))

  const ministryRoutes = ministries.map((m) => ({
    url: `${siteUrl}/ministerios/${m.slug}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...ministryRoutes]
}
