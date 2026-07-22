'use client'

import { useMemo, useState } from 'react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Reveal } from '@/components/motion/reveal'
import { ResourceCard } from '@/components/resources/resource-card'
import { FiltersBar, type SortOrder } from '@/components/resources/filters-bar'
import { NowPlayingBar } from '@/components/resources/now-playing-bar'
import {
  resourceTypeLabels,
  type Resource,
  type ResourceType,
} from '@/lib/data'

type TabValue = 'todas' | ResourceType

export function ResourcesExplorer({ resources }: { resources: Resource[] }) {
  const [tab, setTab] = useState<TabValue>('todas')
  const [query, setQuery] = useState('')
  const [series, setSeries] = useState('todas')
  const [topic, setTopic] = useState('todos')
  const [speaker, setSpeaker] = useState('todos')
  const [sort, setSort] = useState<SortOrder>('reciente')
  const [current, setCurrent] = useState<Resource | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const seriesOptions = useMemo(
    () =>
      Array.from(
        new Set(resources.map((r) => r.series).filter(Boolean)),
      ).sort() as string[],
    [resources],
  )
  const topicOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.topic))).sort(),
    [resources],
  )
  const speakerOptions = useMemo(
    () => Array.from(new Set(resources.map((r) => r.speaker))).sort(),
    [resources],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources
      .filter((r) => tab === 'todas' || r.type === tab)
      .filter((r) => series === 'todas' || r.series === series)
      .filter((r) => topic === 'todos' || r.topic === topic)
      .filter((r) => speaker === 'todos' || r.speaker === speaker)
      .filter(
        (r) =>
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.speaker.toLowerCase().includes(q) ||
          r.topic.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        sort === 'reciente'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date),
      )
  }, [resources, tab, series, topic, speaker, query, sort])

  function handlePlay(resource: Resource) {
    setCurrent(resource)
    setDialogOpen(true)
  }

  return (
    <div>
      <Reveal>
        <FiltersBar
          query={query}
          onQueryChange={setQuery}
          series={seriesOptions}
          seriesValue={series}
          onSeriesChange={setSeries}
          topics={topicOptions}
          topicValue={topic}
          onTopicChange={setTopic}
          speakers={speakerOptions}
          speakerValue={speaker}
          onSpeakerChange={setSpeaker}
          sort={sort}
          onSortChange={setSort}
        />
      </Reveal>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="mt-10"
      >
        <TabsList
          variant="line"
          className="h-auto flex-wrap justify-start gap-1 border-b border-foreground/10 pb-0"
        >
          <TabsTrigger value="todas" className="px-4 py-3 text-sm">
            Todas
          </TabsTrigger>
          {(Object.keys(resourceTypeLabels) as ResourceType[]).map((t) => (
            <TabsTrigger key={t} value={t} className="px-4 py-3 text-sm">
              {resourceTypeLabels[t]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-10">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">
              No encontramos recursos con esos filtros.
            </p>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r, i) => (
                <Reveal key={r.slug} delay={(i % 3) * 0.06}>
                  <ResourceCard resource={r} onPlay={handlePlay} />
                </Reveal>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl sm:max-w-3xl">
          <DialogTitle>{current?.title}</DialogTitle>
          {current?.youtubeId && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                key={current.youtubeId}
                src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1`}
                title={current.title}
                allow="accelerate-compute; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <NowPlayingBar
        resource={current}
        isOpen={dialogOpen}
        onToggle={() => setDialogOpen((o) => !o)}
        onClose={() => {
          setDialogOpen(false)
          setCurrent(null)
        }}
      />
    </div>
  )
}
