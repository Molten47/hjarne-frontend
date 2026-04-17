// src/api/auth.ts — mock implementation
import { db, delay, MOCK_USERS } from '../mock/MockData'
import type { LoginResponse, User } from '../types'

export const authApi = {
  login: async (email: string, _password: string): Promise<LoginResponse> => {
    await delay()
    const entry = MOCK_USERS[email]
    if (!entry) throw new Error('Invalid email or password')
    return {
      access_token:        entry.token,
      refresh_token:       entry.token + '-refresh',
      token_type:          'Bearer',
      expires_in:          3600,
      must_change_password: false,
      user:                entry.user,
    }
  },

  refresh: async (_refreshToken: string) => {
    await delay(100)
    return { access_token: 'mock-token-refreshed', refresh_token: 'mock-refresh-new', expires_in: 3600 }
  },

  changePassword: async (_newPassword: string) => {
    await delay(200)
  },

  me: async (): Promise<User> => {
    await delay(100)
    const raw = localStorage.getItem('hjarne_user')
    if (raw) return JSON.parse(raw) as User
    return MOCK_USERS['admin@hjarne.no'].user
  },

  logout: async () => {
    await delay(100)
    localStorage.removeItem('hjarne_token')
    localStorage.removeItem('hjarne_refresh_token')
    localStorage.removeItem('hjarne_user')
  },
}