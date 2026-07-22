import type { Metadata } from 'next'
import { PageHero } from '@/components/brand/page-hero'
import { ResourcesExplorer } from '@/components/resources/explorer'
import { resources } from '@/lib/data'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Recursos',
  description:
    'Prédicas, enseñanzas, devocionales y guías de discipulado de Casa Vida. Escucha, lee y crece dondequiera que estés.',
  path: '/recursos',
})

export default function RecursosPage() {
  return (
    <>
      <PageHero
        label="Recursos"
        lines={['Para toda', 'la semana']}
        description="Prédicas, enseñanzas, devocionales y guías de discipulado — todo lo que necesitas para seguir creciendo entre domingo y domingo."
      />
      <section className="border-t border-foreground/10 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ResourcesExplorer resources={resources} />
        </div>
      </section>
    </>
  )
}
