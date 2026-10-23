export const API_BASE = '/api'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function getToken(): string | null {
  return localStorage.getItem('token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const text = await res.text()
      if (text) {
        try {
          const json = JSON.parse(text)
          message = json.message || json.error || message
        } catch {
          message = text
        }
      } else if (res.status === 401 || res.status === 403) {
        message = 'Your session has expired or you are not authorised. Please log in again.'
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status)
  }

  const text = await res.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

/** Backend serialises the event id as `eventid`; accept both spellings. */
export function eventIdOf(event: any): number {
  return Number(event?.eventid ?? event?.Eventid ?? event?.EventId ?? 0)
}

export function eventStatusOf(event: any): string {
  return String(event?.eventStatus ?? event?.EventStatus ?? '')
}
