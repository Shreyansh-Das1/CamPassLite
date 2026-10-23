import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import EventCard from '../components/EventCard'

const Stat: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="card p-5">
    <p className="text-2xl font-bold text-primary">{value}</p>
    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
  </div>
)

const HomePage: React.FC = () => {
  const { user, isOrganizer, isAdmin } = useAuth()
  const { events, loading, register, pendingEventId, registrationFor } = useEvents()

  const featured = events.slice(0, 3)
  const totalSeats = events.reduce((sum, e) => sum + Number(e.capacity ?? 0), 0)
  const totalBooked = events.reduce((sum, e) => sum + Number(e.booked ?? 0), 0)

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-primary/5 via-surface to-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Campus Event Management
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-primary sm:text-5xl">
              Discover, register and run campus events in one place.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted">
              CamPassLite connects students, organizers and administrators. Browse approved
              events, reserve your seat, and manage everything from a single dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {!user ? (
                <>
                  <Link to="/register" className="btn-accent">
                    Create an account
                  </Link>
                  <Link to="/login" className="btn-ghost">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/events" className="btn-accent">
                    Browse events
                  </Link>
                  <Link to="/dashboard" className="btn-ghost">
                    Go to dashboard
                  </Link>
                </>
              )}
              {isOrganizer && (
                <Link to="/organizer" className="btn-ghost">
                  Create an event
                </Link>
              )}
            </div>

            <p className="mt-6 text-xs text-muted">
              Signed in as{' '}
              <span className="font-semibold text-foreground">
                {user ? `${user.name} (${user.role})` : 'guest'}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Stat label="Approved events" value={loading ? '—' : events.length} />
            <Stat label="Seats available" value={loading ? '—' : Math.max(totalSeats - totalBooked, 0)} />
            <Stat label="Registrations" value={loading ? '—' : totalBooked} />
            <Stat label="Your role" value={user ? user.role : 'GUEST'} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-primary">Upcoming events</h2>
            <p className="mt-1 text-sm text-muted">
              {user
                ? 'The latest approved events on campus.'
                : 'Sign in to see live events and reserve your seat.'}
            </p>
          </div>
          <Link to="/events" className="btn-ghost">
            View all
          </Link>
        </div>

        {!user ? (
          <div className="card p-10 text-center">
            <h3 className="text-lg font-semibold text-primary">Events are members-only</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Log in with your campus account to browse approved events and register.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-ghost">
                Register
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card h-72 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="card p-10 text-center">
            <h3 className="text-lg font-semibold text-primary">No approved events yet</h3>
            <p className="mt-2 text-sm text-muted">
              {isOrganizer || isAdmin
                ? 'Create an event to get started.'
                : 'Check back soon — new events will appear here.'}
            </p>
            {isOrganizer && (
              <Link to="/organizer" className="btn-accent mt-5">
                Create event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event) => {
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
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              title: 'Students',
              body: 'Browse approved events, reserve a seat in one click and manage your registrations.',
            },
            {
              title: 'Organizers',
              body: 'Publish campus events with venue, schedule and capacity in a couple of minutes.',
            },
            {
              title: 'Administrators',
              body: 'Keep the calendar healthy by approving or cancelling events across campus.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-accent">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
