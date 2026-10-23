import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setEventStatus, useEvents } from '../context/EventsContext'
import { eventIdOf, eventStatusOf } from '../api/client'
import { useToast } from '../components/Toast'
import { formatDate } from '../utils/format'

const StatCard: React.FC<{ label: string; value: string | number; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div className="card p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-primary">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
  </div>
)

const DashboardPage: React.FC = () => {
  const { user, isStudent, isOrganizer, isAdmin } = useAuth()
  const {
    events,
    registrations,
    loadingRegistrations,
    loading,
    cancel,
    pendingEventId,
    refreshEvents,
  } = useEvents()
  const { notify } = useToast()
  const [busyEvent, setBusyEvent] = useState<number | null>(null)

  const myEventIds = useMemo<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('camppass:my-events') || '[]')
    } catch {
      return []
    }
  }, [])

  const myEvents = events.filter((e) => myEventIds.includes(eventIdOf(e)))
  const activeRegistrations = registrations.filter((r) => r.status === 'ACTIVE')
  const cancelledRegistrations = registrations.filter((r) => r.status === 'CANCELLED')

  const handleCancelEvent = async (eventId: number) => {
    setBusyEvent(eventId)
    try {
      await setEventStatus(eventId, 'CANCELLED')
      await refreshEvents()
      notify('Event cancelled.', 'success')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not cancel event.', 'error')
    } finally {
      setBusyEvent(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm text-muted">Signed in as</p>
        <h1 className="mt-1 text-3xl font-bold text-primary">
          {user?.name}{' '}
          <span className="inline-flex translate-y-[-2px] rounded-full bg-accent/10 px-2.5 py-0.5 align-middle text-xs font-bold text-accent">
            {user?.role}
          </span>
        </h1>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>
      </div>

      {isStudent && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="My registrations" value={registrations.length} />
            <StatCard label="Active" value={activeRegistrations.length} hint="Seats reserved" />
            <StatCard label="Available events" value={events.length} hint="Approved on campus" />
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-bold text-primary">My registered events</h2>
              <Link to="/events" className="text-sm font-semibold text-accent hover:underline">
                Browse events
              </Link>
            </div>

            {loadingRegistrations ? (
              <div className="p-6">
                <div className="h-16 animate-pulse rounded-lg bg-border/60" />
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="font-semibold text-primary">No registrations yet</h3>
                <p className="mt-1 text-sm text-muted">
                  Reserve a seat for an approved event to see it here.
                </p>
                <Link to="/events" className="btn-accent mt-4">
                  Browse events
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {registrations.map((reg) => (
                  <li key={reg.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <Link
                        to={`/events/${reg.eventId}`}
                        className="font-semibold text-foreground hover:text-accent"
                      >
                        {reg.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDate(reg.date)} {reg.venue ? `· ${reg.venue}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          reg.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {reg.status || 'ACTIVE'}
                      </span>
                      {reg.status === 'ACTIVE' && (
                        <button
                          type="button"
                          className="btn-danger"
                          disabled={pendingEventId === reg.eventId}
                          onClick={() => cancel(reg.eventId)}
                        >
                          {pendingEventId === reg.eventId ? 'Cancelling…' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cancelledRegistrations.length > 0 && (
            <p className="mt-4 text-xs text-muted">
              {cancelledRegistrations.length} cancelled registration
              {cancelledRegistrations.length === 1 ? '' : 's'} are kept for your records.
            </p>
          )}
        </>
      )}

      {isOrganizer && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Events I created" value={myEvents.length} />
            <StatCard label="Approved on campus" value={events.length} />
            <StatCard
              label="Total registrations"
              value={events.reduce((sum, e) => sum + Number(e.booked ?? 0), 0)}
            />
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-bold text-primary">My events</h2>
              <Link to="/organizer" className="btn-accent">
                Create event
              </Link>
            </div>

            {loading ? (
              <div className="p-6">
                <div className="h-16 animate-pulse rounded-lg bg-border/60" />
              </div>
            ) : myEvents.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="font-semibold text-primary">No events created yet</h3>
                <p className="mt-1 text-sm text-muted">
                  Publish your first campus event from the organizer page.
                </p>
                <Link to="/organizer" className="btn-accent mt-4">
                  Create event
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {myEvents.map((ev) => {
                  const id = eventIdOf(ev)
                  return (
                    <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <Link to={`/events/${id}`} className="font-semibold hover:text-accent">
                          {ev.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDate(ev.date)} · {ev.booked}/{ev.capacity} registered
                        </p>
                      </div>
                      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-bold text-success">
                        {eventStatusOf(ev) || 'APPROVED'}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {isAdmin && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard label="Approved events" value={events.length} />
            <StatCard
              label="Total registrations"
              value={events.reduce((sum, e) => sum + Number(e.booked ?? 0), 0)}
            />
            <StatCard
              label="Total capacity"
              value={events.reduce((sum, e) => sum + Number(e.capacity ?? 0), 0)}
            />
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-bold text-primary">Manage events</h2>
              <button className="btn-ghost" onClick={() => refreshEvents()}>
                Refresh
              </button>
            </div>

            {events.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">No approved events.</div>
            ) : (
              <ul className="divide-y divide-border">
                {events.map((ev) => {
                  const id = eventIdOf(ev)
                  return (
                    <li key={id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                      <div>
                        <Link to={`/events/${id}`} className="font-semibold hover:text-accent">
                          {ev.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDate(ev.date)} · {ev.venue} · {ev.booked}/{ev.capacity}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={busyEvent === id}
                        onClick={() => handleCancelEvent(id)}
                      >
                        {busyEvent === id ? 'Cancelling…' : 'Cancel event'}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage
