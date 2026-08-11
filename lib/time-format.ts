// Service times are stored/displayed as friendly strings ("10:00 a.m.") so
// the public site never has to reformat them. These convert to/from 24h
// HH:MM only for the admin editor's native <input type="time"> picker.

export function parseFriendlyTime(value: string): string | null {
  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(a\.?\s?m\.?|p\.?\s?m\.?)$/i)
  if (!match) return null

  const hour12 = Number(match[1])
  const minute = match[2]
  if (hour12 < 1 || hour12 > 12) return null
  const isPM = match[3].toLowerCase().startsWith('p')

  let hour24 = hour12 % 12
  if (isPM) hour24 += 12

  return `${String(hour24).padStart(2, '0')}:${minute}`
}

export function formatFriendlyTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const hour12 = h % 12 || 12
  const meridiem = h < 12 ? 'a.m.' : 'p.m.'
  return `${hour12}:${String(m).padStart(2, '0')} ${meridiem}`
}
