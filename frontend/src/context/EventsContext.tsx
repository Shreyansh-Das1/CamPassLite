import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiFetch, eventIdOf, eventStatusOf } from '../api/client'
import { useAuth } from './AuthContext'
import { useToast } from '../components/Toast'

export interface RegistrationView {
  id: number
  eventId: number
  title: string
  status: string
  date?: unknown
  venue?: string
}

interface EventsContextValue {
  events: any[]
  loading: boolean
  error: string | null
  refreshEvents: () => Promise<void>
  registrations: RegistrationView[]
  loadingRegistrations: boolean
  refreshRegistrations: () => Promise<void>
  registrationFor: (eventId: number) => RegistrationView | undefined
  register: (eventId: number) => Promise<void>
  cancel: (eventId: number) => Promise<void>
  pendingEventId: number | null
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined)

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isStudent } = useAuth()
  const { notify } = useToast()

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [registrations, setRegistrations] = useState<RegistrationView[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [pendingEventId, setPendingEventId] = useState<number | null>(null)

  const refreshEvents = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setEvents([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<any[]>('/event/getappr')
      setEvents(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRegistrations = useCallback(async () => {
    if (!isStudent) {
      setRegistrations([])
      return
    }
    setLoadingRegistrations(true)
    try {
      const data = await apiFetch<any[]>('/registration/registered')
      const list = (Array.isArray(data) ? data : []).map<RegistrationView>((reg) => ({
        id: Number(reg.registrationId ?? reg.ticketId ?? 0),
        eventId: eventIdOf(reg.event),
        title: reg.event?.title ?? reg.evTitle ?? reg.EvTitle ?? 'Event',
        status: String(reg.regStats ?? reg.regisStatus ?? reg.regisStatus ?? ''),
        date: reg.event?.date,
        venue: reg.event?.venue,
      }))
      setRegistrations(list)
    } catch {
      setRegistrations([])
    } finally {
      setLoadingRegistrations(false)
    }
  }, [isStudent])

  useEffect(() => {
    void refreshEvents()
    void refreshRegistrations()
  }, [user?.id, refreshEvents, refreshRegistrations])

  const registrationFor = useCallback(
    (eventId: number) => registrations.find((r) => r.eventId === eventId),
    [registrations],
  )

  const register = useCallback(
    async (eventId: number) => {
      setPendingEventId(eventId)
      try {
        await apiFetch('/registration/reserve', {
          method: 'PUT',
          body: JSON.stringify(eventId),
        })
        notify('You are registered for this event.', 'success')
        await Promise.all([refreshEvents(), refreshRegistrations()])
      } catch (err) {
        notify(
          err instanceof Error ? err.message : 'Could not register for this event.',
          'error',
        )
      } finally {
        setPendingEventId(null)
      }
    },
    [notify, refreshEvents, refreshRegistrations],
  )

  const cancel = useCallback(
    async (eventId: number) => {
      setPendingEventId(eventId)
      try {
        await apiFetch('/registration/cancel', {
          method: 'DELETE',
          body: JSON.stringify(eventId),
        })
        notify('Registration cancelled.', 'success')
        await Promise.all([refreshEvents(), refreshRegistrations()])
      } catch (err) {
        notify(
          err instanceof Error ? err.message : 'Could not cancel registration.',
          'error',
        )
      } finally {
        setPendingEventId(null)
      }
    },
    [notify, refreshEvents, refreshRegistrations],
  )

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      loading,
      error,
      refreshEvents,
      registrations,
      loadingRegistrations,
      refreshRegistrations,
      registrationFor,
      register,
      cancel,
      pendingEventId,
    }),
    [
      events,
      loading,
      error,
      refreshEvents,
      registrations,
      loadingRegistrations,
      refreshRegistrations,
      registrationFor,
      register,
      cancel,
      pendingEventId,
    ],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used inside <EventsProvider>')
  return ctx
}

/** Admin-only helper to change an event's approval status. */
export async function setEventStatus(eventId: number, status: 'APPROVED' | 'CANCELLED') {
  return apiFetch(`/event/${eventId}/approval`, {
    method: 'PUT',
    body: JSON.stringify(status),
  })
}

export { eventStatusOf }
