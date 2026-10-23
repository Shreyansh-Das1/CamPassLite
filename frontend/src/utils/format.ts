function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Handles ISO strings, arrays ([y,m,d,h,mi,s]) and null from the Java backend. */
function toDate(value: unknown): Date | null {
  if (!value) return null
  if (Array.isArray(value)) {
    const [y, m = 1, d = 1, h = 0, min = 0, s = 0] = value as number[]
    return new Date(y, m - 1, d, h, min, s)
  }
  const parsed = new Date(String(value))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function formatDate(value: unknown): string {
  const date = toDate(value)
  if (!date) return 'Date TBA'
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(value: unknown): string {
  const date = toDate(value)
  if (!date) return 'TBA'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatTime(value: unknown): string {
  if (!value) return 'TBA'
  let hours = 0
  let minutes = 0
  if (Array.isArray(value)) {
    hours = Number(value[0] ?? 0)
    minutes = Number(value[1] ?? 0)
  } else {
    const [h, m] = String(value).split(':')
    hours = Number(h ?? 0)
    minutes = Number(m ?? 0)
  }
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const h12 = hours % 12 === 0 ? 12 : hours % 12
  return `${h12}:${pad(minutes)} ${suffix}`
}

export function formatTimeRange(start: unknown, end: unknown): string {
  return `${formatTime(start)} – ${formatTime(end)}`
}

/** Builds the ISO LocalDateTime string the Java backend expects. */
export function toLocalDateTime(date: string, time: string): string {
  return `${date}T${time.length === 5 ? `${time}:00` : time}`
}
