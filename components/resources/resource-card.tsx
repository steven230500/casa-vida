import Link from 'next/link'
import Image from 'next/image'
import { Play, BookOpen, Download } from 'lucide-react'
import { formatDate, resourceTypeLabels, type Resource } from '@/lib/data'

export function ResourceCard({
  resource,
  onPlay,
}: {
  resource: Resource
  onPlay: (resource: Resource) => void
}) {
  const playable = Boolean(resource.youtubeId)

  return (
    <div className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={resource.thumbnail || '/placeholder.svg'}
          alt={resource.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
        />
        {playable ? (
          <button
            type="button"
            onClick={() => onPlay(resource)}
            aria-label={`Reproducir ${resource.title}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-transform duration-500 group-hover:scale-110">
              <Play className="size-5 translate-x-0.5 fill-current" />
            </span>
          </button>
        ) : (
          <Link
            href={`/recursos/${resource.slug}`}
            aria-label={
              resource.type === 'guia'
                ? `Descargar ${resource.title}`
                : `Leer ${resource.title}`
            }
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-transform duration-500 group-hover:scale-110">
              {resource.type === 'guia' ? (
                <Download className="size-5" />
              ) : (
                <BookOpen className="size-5" />
              )}
            </span>
          </Link>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
        <span>{resource.series ?? resourceTypeLabels[resource.type]}</span>
        <span aria-hidden>·</span>
        <span>{resource.duration ?? formatDate(resource.date)}</span>
      </div>
      <Link href={`/recursos/${resource.slug}`} className="group/title block">
        <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover/title:text-muted-foreground">
          {resource.title}
        </h3>
      </Link>
      <p className="mt-1 text-sm text-muted-foreground">{resource.speaker}</p>
    </div>
  )
}
