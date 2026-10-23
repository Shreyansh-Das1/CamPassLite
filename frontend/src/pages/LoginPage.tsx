import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = await apiFetch<string>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }),
      })
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid email or password.')
      }
      await login(token.trim())
      notify('Welcome back!', 'success')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      notify(
        err instanceof Error && err.message.includes('401')
          ? 'Invalid email or password.'
          : err instanceof Error
            ? err.message
            : 'Login failed.',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-extrabold leading-tight text-primary">
          Welcome back to CamPassLite.
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted">
          Sign in to browse approved campus events, reserve your seat and manage your
          registrations — all in one place.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          {[
            'JWT-secured sessions',
            'Role-based dashboards for students, organizers and admins',
            'One-click event registration and cancellation',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card mx-auto w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-primary">Sign in</h2>
        <p className="mt-1 text-sm text-muted">Use the email you registered with.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="you@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
