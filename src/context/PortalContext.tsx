import {
  createContext, useContext, useState,
  useEffect, type ReactNode,
} from 'react'
import { portalApi, type PortalUser } from '../api/portal'
import { apiClient } from '../api/client'

interface PortalContextValue {
  portalUser:        PortalUser | null
  isAuthenticated:   boolean
  isLoading:         boolean
  login:             (mrn: string, password: string) => Promise<void>
  logout:            () => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const [portalUser, setPortalUser] = useState<PortalUser | null>(() => {
    try {
      const u = localStorage.getItem('hjarne_portal_user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (portalUser?.access_token) {
      apiClient.defaults.headers.common['Authorization'] =
        `Bearer ${portalUser.access_token}`
    }
  }, [portalUser])

  const login = async (mrn: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await portalApi.login({ mrn, password })
      localStorage.setItem('hjarne_portal_user', JSON.stringify(data))
      localStorage.setItem('hjarne_token', data.access_token)
      apiClient.defaults.headers.common['Authorization'] =
        `Bearer ${data.access_token}`
      setPortalUser(data)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('hjarne_portal_user')
    localStorage.removeItem('hjarne_token')
    delete apiClient.defaults.headers.common['Authorization']
    setPortalUser(null)
  }

  return (
    <PortalContext.Provider value={{
      portalUser,
      isAuthenticated: !!portalUser,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </PortalContext.Provider>
  )
}

export const usePortal = () => {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}