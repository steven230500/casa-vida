import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { siteUrl } from '@/lib/seo'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Casa Vida — Iglesia en Cartagena',
    template: '%s — Casa Vida',
  },
  description:
    'Casa Vida es una iglesia en Cartagena, Colombia. Aquí hay lugar para ti. Servicio dominical 10:00 a.m. y jóvenes los sábados 5:00 p.m. en Manga.',
  keywords: [
    'iglesia Cartagena',
    'Casa Vida',
    'iglesia cristiana',
    'Manga Cartagena',
    'prédicas',
    'comunidad de fe',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: siteUrl,
    siteName: 'Casa Vida',
    title: 'Casa Vida — Iglesia en Cartagena',
    description:
      'Aquí hay lugar para ti. Una comunidad de fe en el corazón de Cartagena.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Vida — Iglesia en Cartagena',
    description: 'Aquí hay lugar para ti. Una comunidad de fe en Cartagena.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-CO" className={`light ${poppins.variable}`}>
      <body className="bg-background font-sans antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
