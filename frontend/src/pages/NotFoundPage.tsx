import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => (
  <div className="mx-auto max-w-2xl px-4 py-24 text-center">
    <p className="text-6xl font-extrabold text-primary">404</p>
    <h1 className="mt-4 text-2xl font-bold text-primary">Page not found</h1>
    <p className="mt-2 text-sm text-muted">
      The page you are looking for does not exist or has been moved.
    </p>
    <div className="mt-6 flex justify-center gap-3">
      <Link to="/" className="btn-primary">
        Back home
      </Link>
      <Link to="/events" className="btn-ghost">
        Browse events
      </Link>
    </div>
  </div>
)

export default NotFoundPage
