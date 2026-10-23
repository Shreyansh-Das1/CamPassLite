import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setEventStatus, useEvents } from '../context/EventsContext'
import { eventIdOf, eventStatusOf } from '../api/client'
import { formatDate, formatTimeRange } from '../utils/format'
import { useToast } from '../components/Toast'

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="rounded-lg border border-border bg-background/60 p-4">
    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
    <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
  </div>
)

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { user, isStudent, isAdmin } = useAuth()
  const {
    events,
    loading,
    register,
    cancel,
    registrationFor,
    pendingEventId,
    refreshEvents,
  } = useEvents()
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const eventId = Number(id)
  const event = events.find((e) => eventIdOf(e) === eventId)

  if (loading && !event) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="card h-96 animate-pulse" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary">Event not found</h1>
        <p className="mt-2 text-sm text-muted">
          This event may have been removed, cancelled, or not yet approved.
        </p>
        <Link to="/events" className="btn-primary mt-6">
          Back to events
        </Link>
      </div>
    )
  }

  const status = eventStatusOf(event)
  const capacity = Number(event.capacity ?? 0)
  const booked = Number(event.booked ?? 0)
  const seatsLeft = Math.max(capacity - booked, 0)
  const registration = registrationFor(eventId)
  const isFull = capacity > 0 && booked >= capacity
  const busy = pendingEventId === eventId

  const handleAdminStatus = async (next: 'APPROVED' | 'CANCELLED') => {
    setUpdatingStatus(true)
    try {
      await setEventStatus(eventId, next)
      await refreshEvents()
      notify(`Event marked as ${next}.`, 'success')
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update event status.', 'error')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <button type="button" className="mb-6 text-sm font-medium text-muted hover:text-primary" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Campus event
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight">{event.title}</h1>
              <p className="mt-2 text-sm text-white/80">
                {formatDate(event.date)} · {formatTimeRange(event.startTime, event.endTime)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                status === 'APPROVED'
                  ? 'bg-white/15 text-white'
                  : 'bg-danger text-white'
              }`}
            >
              {status || 'PENDING'}
            </span>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">About this event</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {event.description || 'No description provided.'}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <Row label="Venue">{event.venue || 'Venue TBA'}</Row>
              <Row label="Date">{formatDate(event.date)}</Row>
              <Row label="Time">{formatTimeRange(event.startTime, event.endTime)}</Row>
              <Row label="Capacity">
                {capacity > 0 ? `${booked} / ${capacity} registered` : 'Unlimited'}
              </Row>
            </dl>
          </div>

          <aside className="rounded-xl border border-border bg-background/60 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Registration</h2>

            {capacity > 0 && (
              <>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-primary">{seatsLeft}</span>
                  <span className="text-xs text-muted">seats left</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${isFull ? 'bg-danger' : 'bg-accent'}`}
                    style={{ width: `${capacity ? Math.min((booked / capacity) * 100, 100) : 0}%` }}
                  />
                </div>
              </>
            )}

            <div className="mt-5 space-y-2">
              {!user && (
                <Link to="/login" className="btn-primary w-full">
                  Sign in to register
                </Link>
              )}

              {user && isStudent && status === 'APPROVED' && (
                <>
                  {!registration && (
                    <button
                      type="button"
                      className="btn-accent w-full"
                      disabled={isFull || busy}
                      onClick={() => register(eventId)}
                    >
                      {isFull ? 'Event full' : busy ? 'Registering…' : 'Register for event'}
                    </button>
                  )}
                  {registration && (
                    <div className="space-y-2">
                      <p
                        className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                          registration.status === 'ACTIVE'
                            ? 'bg-success/10 text-success'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        Your registration: {registration.status || 'ACTIVE'}
                      </p>
                      {registration.status === 'ACTIVE' && (
                        <button
                          type="button"
                          className="btn-danger w-full"
                          disabled={busy}
                          onClick={() => cancel(eventId)}
                        >
                          {busy ? 'Cancelling…' : 'Cancel registration'}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {user && isStudent && status !== 'APPROVED' && (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-center text-xs font-semibold text-danger">
                  This event is not open for registration.
                </p>
              )}

              {user && !isStudent && !isAdmin && (
                <p className="text-xs text-muted">
                  Only students can reserve seats. Use your organizer tools to manage events.
                </p>
              )}

              {isAdmin && (
                <div className="space-y-2 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Admin actions
                  </p>
                  {status !== 'APPROVED' && (
                    <button
                      type="button"
                      className="btn-primary w-full"
                      disabled={updatingStatus}
                      onClick={() => handleAdminStatus('APPROVED')}
                    >
                      Approve event
                    </button>
                  )}
                  {status === 'APPROVED' && (
                    <button
                      type="button"
                      className="btn-danger w-full"
                      disabled={updatingStatus}
                      onClick={() => handleAdminStatus('CANCELLED')}
                    >
                      Cancel event
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
