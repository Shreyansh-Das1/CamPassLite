import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiFetch } from '../api/client'

export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  number?: string
  role: UserRole
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  isStudent: boolean
  isOrganizer: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  )
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem('token')
    if (!stored) {
      setUser(null)
      setToken(null)
      setLoading(false)
      return
    }
    try {
      const me = await apiFetch<User>('/auth/me')
      setUser(me)
      setToken(stored)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUser()
  }, [loadUser])

  const login = useCallback(async (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    const me = await apiFetch<User>('/auth/me')
    setUser(me)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isStudent: user?.role === 'STUDENT',
      isOrganizer: user?.role === 'ORGANIZER',
      isAdmin: user?.role === 'ADMIN',
    }),
    [user, token, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
