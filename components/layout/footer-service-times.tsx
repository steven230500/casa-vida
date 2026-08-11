'use client'

import { useEffect, useState } from 'react'
import { serviceTimes as seedServiceTimes, type ServiceTime } from '@/lib/data'

/**
 * Renders the static seed times first (matches SSR output, no hydration
 * mismatch or layout flash), then swaps in whatever the admin has actually
 * set once /api/service-times resolves.
 */
export function FooterServiceTimes() {
  const [serviceTimes, setServiceTimes] = useState<ServiceTime[]>(seedServiceTimes)

  useEffect(() => {
    fetch('/api/service-times')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.serviceTimes) && data.serviceTimes.length > 0) {
          setServiceTimes(data.serviceTimes)
        }
      })
      .catch(() => {
        // Keep the seed values shown if the fetch fails.
      })
  }, [])

  return (
    <ul className="mt-5 space-y-4">
      {serviceTimes.map((s) => (
        <li key={s.title} className="text-sm">
          <p className="font-medium">{s.day}</p>
          <p className="text-background/60">
            {s.time} · {s.title}
          </p>
        </li>
      ))}
    </ul>
  )
}
