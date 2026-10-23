import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch, eventIdOf, eventStatusOf } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import { useToast } from '../components/Toast'
import { formatDate, formatTimeRange } from '../utils/format'

const emptyForm = {
  title: '',
  description: '',
  venue: '',
  capacity: '50',
  date: '',
  startTime: '',
  endTime: '',
}

const OrganizerPage: React.FC = () => {
  const { isOrganizer } = useAuth()
  const { notify } = useToast()
  const { events, refreshEvents } = useEvents()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [myEventIds, setMyEventIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('camppass:my-events') || '[]')
    } catch {
      return []
    }
  })

  const canCreate = isOrganizer
  const myEvents = useMemo(
    () => events.filter((e) => myEventIds.includes(eventIdOf(e))),
    [events, myEventIds],
  )

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const saveMyEvent = (id: number) => {
    const next = Array.from(new Set([...myEventIds, id]))
    setMyEventIds(next)
    localStorage.setItem('camppass:my-events', JSON.stringify(next))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date || !form.startTime || !form.endTime) {
      notify('Please choose a date and start/end time.', 'error')
      return
    }
    if (form.endTime <= form.startTime) {
      notify('End time must be after start time.', 'error')
      return
    }
    if (Number(form.capacity) < 1) {
      notify('Capacity must be at least 1.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const created = await apiFetch<any>('/event/create', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          venue: form.venue,
          capacity: Number(form.capacity),
          date: `${form.date}T00:00:00`,
          startTime: form.startTime,
          endTime: form.endTime,
        }),
      })
      const id = eventIdOf(created)
      if (id) saveMyEvent(id)
      notify('Event published successfully.', 'success')
      setForm(emptyForm)
      await refreshEvents()
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not create the event.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!canCreate) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary">Organizers only</h1>
        <p className="mt-2 text-sm text-muted">
          Your account does not have permission to create events.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Organizer studio</h1>
        <p className="mt-1 text-sm text-muted">
          Publish a new campus event. It is immediately visible to students.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form className="card p-6 sm:p-8" onSubmit={handleSubmit}>
          <h2 className="text-lg font-bold text-primary">New event</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                required
                className="input"
                placeholder="Hackathon 2026"
                value={form.title}
                onChange={update('title')}
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="input resize-y"
                placeholder="What is this event about?"
                value={form.description}
                onChange={update('description')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="venue" className="mb-1.5 block text-sm font-medium">
                  Venue
                </label>
                <input
                  id="venue"
                  required
                  className="input"
                  placeholder="Main auditorium"
                  value={form.venue}
                  onChange={update('venue')}
                />
              </div>
              <div>
                <label htmlFor="capacity" className="mb-1.5 block text-sm font-medium">
                  Capacity
                </label>
                <input
                  id="capacity"
                  type="number"
                  min={1}
                  required
                  className="input"
                  value={form.capacity}
                  onChange={update('capacity')}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  className="input"
                  value={form.date}
                  onChange={update('date')}
                />
              </div>
              <div>
                <label htmlFor="startTime" className="mb-1.5 block text-sm font-medium">
                  Start time
                </label>
                <input
                  id="startTime"
                  type="time"
                  required
                  className="input"
                  value={form.startTime}
                  onChange={update('startTime')}
                />
              </div>
              <div>
                <label htmlFor="endTime" className="mb-1.5 block text-sm font-medium">
                  End time
                </label>
                <input
                  id="endTime"
                  type="time"
                  required
                  className="input"
                  value={form.endTime}
                  onChange={update('endTime')}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-accent" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish event'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setForm(emptyForm)}
              disabled={submitting}
            >
              Reset
            </button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-primary">Event checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {[
                'Pick a clear, searchable title.',
                'Describe the agenda and who should attend.',
                'Confirm venue and realistic capacity.',
                'Double-check the schedule before publishing.',
              ].map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-accent">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-bold text-primary">My published events</h2>
            </div>
            {myEvents.length === 0 ? (
              <p className="p-5 text-sm text-muted">
                Events you publish will be listed here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {myEvents.map((ev) => {
                  const id = eventIdOf(ev)
                  return (
                    <li key={id} className="px-5 py-4">
                      <Link to={`/events/${id}`} className="font-semibold hover:text-accent">
                        {ev.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDate(ev.date)} · {formatTimeRange(ev.startTime, ev.endTime)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {ev.booked}/{ev.capacity} registered ·{' '}
                        <span className="font-semibold text-success">
                          {eventStatusOf(ev) || 'APPROVED'}
                        </span>
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrganizerPage
