import { apiClient } from './client'
import type { ApiResponse, Appointment } from '../types'

export interface CreateAppointmentPayload {
  patient_id: string
  physician_id?: string
  department: string
  appointment_type: string
  scheduled_at: string
  duration_minutes?: number
  reason?: string
  channel?: string
}

export interface AppointmentFilters {
  patient_id?: string
  status?:     string
}

export const appointmentsApi = {
  list: async (filters?: AppointmentFilters, cursor?: string) => {
    const params = new URLSearchParams()
    
    if (filters?.patient_id)   params.set('patient_id',   filters.patient_id)
    if (filters?.status)       params.set('status',       filters.status)
    if (cursor) {
      const [time, id] = cursor.split(',')
      params.set('cursor_time', time)
      params.set('cursor_id',   id)
    }
    const res = await apiClient.get<ApiResponse<Appointment[]>>(`/appointments?${params}`)
    return {
      data:        res.data.data ?? [],
      next_cursor: res.data.meta?.next_cursor ?? null,
    }
  },
  create: async (payload: CreateAppointmentPayload) => {
    const res = await apiClient.post<ApiResponse<Appointment>>('/appointments', payload)
    return res.data.data!
  },
  updateStatus: async (id: string, status: string, notes?: string) => {
    const res = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/status`,
      { status, notes }
    )
    return res.data.data!
  },
}