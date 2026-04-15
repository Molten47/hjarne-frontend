import { apiClient } from './client'
import type { ApiResponse, LoginResponse, User } from '../types'

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    })
    return res.data.data!
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post<ApiResponse<{
      access_token: string
      refresh_token: string
      expires_in: number
    }>>('/auth/refresh', { refresh_token: refreshToken })
    return res.data.data!
  },

  changePassword: async (newPassword: string) => {
    await apiClient.post('/auth/change-password', { new_password: newPassword })
  },

  me: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me')
    return res.data.data!
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('hjarne_token')
    localStorage.removeItem('hjarne_refresh_token')
    localStorage.removeItem('hjarne_user')
  },
}