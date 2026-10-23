import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-background'
  }`

const Navbar: React.FC = () => {
  const { user, logout, isOrganizer } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
            CP
          </span>
          <span className="text-lg font-bold tracking-tight text-primary">
            CamPass<span className="text-accent">Lite</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" end className={navLink} onClick={close}>
            Home
          </NavLink>
          <NavLink to="/events" className={navLink} onClick={close}>
            Events
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navLink} onClick={close}>
              Dashboard
            </NavLink>
          )}
          {isOrganizer && (
            <NavLink to="/organizer" className={navLink} onClick={close}>
              Organizer
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold leading-tight">{user.name}</p>
                <span className="inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                  {user.role}
                </span>
              </div>
              <button type="button" className="btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn-accent">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLink} onClick={close}>
              Home
            </NavLink>
            <NavLink to="/events" className={navLink} onClick={close}>
              Events
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLink} onClick={close}>
                Dashboard
              </NavLink>
            )}
            {isOrganizer && (
              <NavLink to="/organizer" className={navLink} onClick={close}>
                Organizer
              </NavLink>
            )}
          </div>
          <div className="mt-3 border-t border-border pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <span className="text-[11px] font-semibold text-accent">{user.role}</span>
                </div>
                <button className="btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-ghost flex-1" onClick={close}>
                  Login
                </Link>
                <Link to="/register" className="btn-accent flex-1" onClick={close}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
