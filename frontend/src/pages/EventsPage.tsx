import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import EventCard from '../components/EventCard'

type SortKey = 'date' | 'title' | 'seats'

const EventsPage: React.FC = () => {
  const { user } = useAuth()
  const { events, loading, error, refreshEvents, register, pendingEventId, registrationFor } =
    useEvents()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('date')
  const [hideFull, setHideFull] = useState(false)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const list = events.filter((event) => {
      const matches =
        !term ||
        String(event.title ?? '').toLowerCase().includes(term) ||
        String(event.venue ?? '').toLowerCase().includes(term) ||
        String(event.description ?? '').toLowerCase().includes(term)
      const capacity = Number(event.capacity ?? 0)
      const booked = Number(event.booked ?? 0)
      const full = capacity > 0 && booked >= capacity
      return matches && (!hideFull || !full)
    })

    return [...list].sort((a, b) => {
      if (sort === 'title') return String(a.title ?? '').localeCompare(String(b.title ?? ''))
      if (sort === 'seats') {
        const seatsA = Number(a.capacity ?? 0) - Number(a.booked ?? 0)
        const seatsB = Number(b.capacity ?? 0) - Number(b.booked ?? 0)
        return seatsB - seatsA
      }
      return new Date(String(a.date ?? 0)).getTime() - new Date(String(b.date ?? 0)).getTime()
    })
  }, [events, query, sort, hideFull])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Campus events</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? 'Loading…' : `${filtered.length} approved event${filtered.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button type="button" className="btn-ghost" onClick={() => refreshEvents()}>
          Refresh
        </button>
      </div>

      <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            className="input pl-9"
            placeholder="Search by title, venue or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="date">Sort: soonest</option>
          <option value="title">Sort: title</option>
          <option value="seats">Sort: seats left</option>
        </select>

        <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={hideFull}
            onChange={(e) => setHideFull(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent/30"
          />
          Hide full
        </label>
      </div>

      {!user ? (
        <div className="card p-12 text-center">
          <h2 className="text-lg font-semibold text-primary">Please sign in</h2>
          <p className="mt-2 text-sm text-muted">
            Event listings require an authenticated campus account.
          </p>
          <Link to="/login" className="btn-primary mt-5">
            Login
          </Link>
        </div>
      ) : error ? (
        <div className="card border-danger/30 p-8 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
          <button className="btn-ghost mt-4" onClick={() => refreshEvents()}>
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <h2 className="text-lg font-semibold text-primary">No events found</h2>
          <p className="mt-2 text-sm text-muted">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => {
            const id = Number(event.eventid ?? event.Eventid)
            const registration = registrationFor(id)
            return (
              <EventCard
                key={id}
                event={event}
                onRegister={() => register(id)}
                registering={pendingEventId === id}
                registered={Boolean(registration)}
                registrationStatus={registration?.status}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EventsPage
