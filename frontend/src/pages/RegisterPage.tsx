import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useToast } from '../components/Toast'

const RegisterPage: React.FC = () => {
  const { notify } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    number: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await apiFetch<string>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      const message = typeof response === 'string' ? response : 'User Registered'
      if (message.toLowerCase().includes('not registered')) {
        notify('That email address is already in use.', 'error')
        return
      }
      notify('Account created. Please sign in.', 'success')
      navigate('/login', { replace: true })
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Registration failed.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-extrabold leading-tight text-primary">
          Join the campus event hub.
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted">
          Create your student account to browse approved events and reserve seats. Organizers
          and administrators are provisioned with elevated roles.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm text-muted">
          <p className="font-semibold text-foreground">What you get</p>
          <ul className="mt-2 space-y-1.5">
            <li>• Live approved event listings</li>
            <li>• One-click seat reservation</li>
            <li>• Easy registration cancellation</li>
          </ul>
        </div>
      </div>

      <div className="card mx-auto w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-primary">Create account</h2>
        <p className="mt-1 text-sm text-muted">New accounts are created with the STUDENT role.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              required
              className="input"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={update('name')}
            />
          </div>

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
              value={form.email}
              onChange={update('email')}
            />
          </div>

          <div>
            <label htmlFor="number" className="mb-1.5 block text-sm font-medium">
              Phone number
            </label>
            <input
              id="number"
              type="tel"
              required
              className="input"
              placeholder="9876543210"
              value={form.number}
              onChange={update('number')}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="input"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={update('password')}
            />
          </div>

          <button type="submit" className="btn-accent w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
