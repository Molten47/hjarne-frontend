import { apiClient } from './client'
import type { ApiResponse, Patient } from '../types'

export interface CreatePatientPayload {
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  blood_group?: string
  genotype?: string
  height_cm?: number
  weight_kg?: number
  nationality?: string
}

export const patientsApi = {
list: async (q?: string, limit = 25, cursor?: string) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    params.set('limit', String(limit))
    if (cursor) params.set('cursor', cursor)
    const res = await apiClient.get<ApiResponse<Patient[]>>(`/patients?${params}`)
    return {
      data:        res.data.data ?? [],
      next_cursor: res.data.meta?.next_cursor ?? null,
    }
  },

  get: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`)
    return res.data.data!
  },

  create: async (payload: CreatePatientPayload) => {
    const res = await apiClient.post<ApiResponse<Patient>>('/patients', payload)
    return res.data.data!
  },
}