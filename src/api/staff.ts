import { apiClient } from './client'
import type { ApiResponse, Staff } from '../types'

export const staffApi = {
  list: async (filters?: { role?: string; department?: string }) => {
    const params = new URLSearchParams()
    if (filters?.role) params.set('role', filters.role)
    if (filters?.department) params.set('department', filters.department)
    const res = await apiClient.get<ApiResponse<Staff[]>>(`/staff?${params}`)
    return res.data.data ?? []
  },

  create: async (payload: {
    first_name: string
    last_name: string
    role: string
    department?: string
    specialization?: string
    license_number?: string
  }) => {
    const res = await apiClient.post<ApiResponse<Staff>>('/staff', payload)
    return res.data.data!
  },
get: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Staff>>(`/staff/${id}`)
    return res.data.data!
  },
  createAuth: async (staffId: string, email: string, password: string) => {
    await apiClient.post(`/staff/${staffId}/auth`, { email, password })
  },

}