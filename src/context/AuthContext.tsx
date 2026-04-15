import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { setupInterceptors } from '../api/interceptors'
import { authApi } from '../api/auth'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  mustChangePassword: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  onPasswordChanged: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem('hjarne_user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('hjarne_token')
  )
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const clearAuth = () => {
    localStorage.removeItem('hjarne_token')
    localStorage.removeItem('hjarne_refresh_token')
    localStorage.removeItem('hjarne_user')
    setToken(null)
    setUser(null)
    setMustChangePassword(false)
  }

  useEffect(() => {
    setupInterceptors(clearAuth)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await authApi.login(email, password)
      localStorage.setItem('hjarne_token', data.access_token)
      localStorage.setItem('hjarne_refresh_token', data.refresh_token)
      localStorage.setItem('hjarne_user', JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
      setMustChangePassword(data.must_change_password)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try { await authApi.logout() } finally { clearAuth() }
  }

  const onPasswordChanged = () => setMustChangePassword(false)

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      mustChangePassword,
      login,
      logout,
      onPasswordChanged,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}