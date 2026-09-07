/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Google still has these indexed from before the routes changed, and was
  // serving them as 404s (3 of them, per Search Console). 301s hand the
  // existing ranking over to the pages that replaced them instead of
  // dropping it.
  async redirects() {
    return [
      // Renamed 2026-07-24.
      { source: '/dar', destination: '/ofrenda', permanent: true },
      // Per-sermon detail pages were removed when /recursos became a
      // YouTube feed; the listing is the closest equivalent.
      { source: '/recursos/:slug', destination: '/recursos', permanent: true },
    ]
  },
}

export default nextConfig
