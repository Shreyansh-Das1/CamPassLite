import React from 'react'
import { Link } from 'react-router-dom'
import { eventIdOf, eventStatusOf } from '../api/client'
import { formatShortDate, formatTimeRange } from '../utils/format'
import { useAuth } from '../context/AuthContext'

interface EventCardProps {
  event: any
  onRegister?: () => void
  onCancelEvent?: () => void
  registering?: boolean
  registered?: boolean
  registrationStatus?: string
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    APPROVED: 'bg-success/10 text-success',
    CANCELLED: 'bg-danger/10 text-danger',
  }
  const label = status || 'PENDING'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        map[label] || 'bg-amber-100 text-amber-700'
      }`}
    >
      {label}
    </span>
  )
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onRegister,
  onCancelEvent,
  registering,
  registered,
  registrationStatus,
}) => {
  const { user, isStudent, isAdmin } = useAuth()
  const id = eventIdOf(event)
  const status = eventStatusOf(event)
  const capacity = Number(event.capacity ?? 0)
  const booked = Number(event.booked ?? 0)
  const isFull = capacity > 0 && booked >= capacity
  const seatsLeft = Math.max(capacity - booked, 0)
  const pct = capacity > 0 ? Math.min(Math.round((booked / capacity) * 100), 100) : 0

  return (
    <article className="card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-foreground">
            {event.title || 'Untitled event'}
          </h3>
          <StatusBadge status={status} />
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-muted">
          {event.description || 'No description provided.'}
        </p>

        <dl className="space-y-2 text-sm text-muted">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.venue || 'Venue TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatShortDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTimeRange(event.startTime, event.endTime)}</span>
          </div>
        </dl>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>{booked} registered</span>
            <span>{capacity > 0 ? `${seatsLeft} seats left` : 'Unlimited'}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${pct >= 100 ? 'bg-danger' : 'bg-accent'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-background/60 px-5 py-3">
        <Link to={`/events/${id}`} className="btn-ghost flex-1">
          Details
        </Link>

        {user && isStudent && status === 'APPROVED' && (
          registered ? (
            <span
              className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                registrationStatus === 'CANCELLED'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-success/10 text-success'
              }`}
            >
              {registrationStatus === 'CANCELLED' ? 'Cancelled' : 'Registered'}
            </span>
          ) : (
            <button
              type="button"
              onClick={onRegister}
              disabled={isFull || registering}
              className="btn-accent flex-1"
            >
              {isFull ? 'Full' : registering ? 'Registering…' : 'Register'}
            </button>
          )
        )}

        {isAdmin && status === 'APPROVED' && onCancelEvent && (
          <button type="button" onClick={onCancelEvent} className="btn-danger flex-1">
            Cancel event
          </button>
        )}
      </div>
    </article>
  )
}

export default EventCard
