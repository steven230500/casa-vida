import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo'
import { ministries, resources } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/nosotros',
    '/recursos',
    '/eventos',
    '/visita',
    '/dar',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))

  const ministryRoutes = ministries.map((m) => ({
    url: `${siteUrl}/ministerios/${m.slug}`,
    lastModified: new Date(),
  }))

  const resourceRoutes = resources.map((r) => ({
    url: `${siteUrl}/recursos/${r.slug}`,
    lastModified: new Date(r.date),
  }))

  return [...staticRoutes, ...ministryRoutes, ...resourceRoutes]
}
