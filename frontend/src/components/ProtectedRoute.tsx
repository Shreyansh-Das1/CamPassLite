import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute: React.FC<{
  children: React.ReactNode
  roles?: Array<'STUDENT' | 'ORGANIZER' | 'ADMIN'>
}> = ({ children, roles }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary">Access denied</h1>
        <p className="mt-2 text-sm text-muted">
          Your role ({user.role}) is not allowed to view this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
