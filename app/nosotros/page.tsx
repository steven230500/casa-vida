import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { History } from '@/components/about/history'
import { Beliefs } from '@/components/about/beliefs'
import { Team } from '@/components/about/team'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Nosotros',
  description:
    'Conoce la historia de Casa Vida, en qué creemos y el equipo pastoral que lidera nuestra comunidad en Cartagena.',
  path: '/nosotros',
})

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        label="Nosotros"
        lines={['No somos un edificio.', 'Somos una familia.']}
        description="Una comunidad de fe que ha crecido durante más de una década en el corazón de Cartagena, siempre con las puertas abiertas."
      />
      <History />
      <Beliefs />
      <Team />
    </>
  )
}
