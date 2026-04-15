import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('hjarne_token'),
  user: (() => {
    try {
      const u = localStorage.getItem('hjarne_user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })(),
  isAuthenticated: !!localStorage.getItem('hjarne_token'),

  setAuth: (token, user) => {
    localStorage.setItem('hjarne_token', token)
    localStorage.setItem('hjarne_user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem('hjarne_token')
    localStorage.removeItem('hjarne_user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))