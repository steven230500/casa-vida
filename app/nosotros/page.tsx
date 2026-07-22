import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { History } from '@/components/about/history'
import { Vision } from '@/components/about/vision'
import { Beliefs } from '@/components/about/beliefs'
import { Team } from '@/components/about/team'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Nosotros',
  description:
    'Conoce la historia de Casa Vida, nuestra visión, en qué creemos y el equipo pastoral que lidera nuestra comunidad en Cartagena.',
  path: '/nosotros',
})

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        label="Nosotros"
        lines={['No somos un edificio.', 'Somos una familia.']}
        description="Una plantación que nació de la convicción de alcanzar personas para Cristo desde cada esfera de la vida, en el corazón de Cartagena."
      />
      <History />
      <Vision />
      <Beliefs />
      <Team />
    </>
  )
}
