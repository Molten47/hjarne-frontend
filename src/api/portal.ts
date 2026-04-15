import { apiClient } from './client'
import type { ApiResponse } from '../types'

export interface PortalLoginPayload {
  mrn:      string
  password: string
}

export interface PortalUser {
  patient_id: string
  mrn:        string
  first_name: string
  last_name:  string
  access_token:  string
  refresh_token: string
  expires_in:    number
}

export interface PortalMe {
  id:            string
  mrn:           string
  first_name:    string
  last_name:     string
  date_of_birth: string
  gender:        string
  blood_group:   string | null
}

export interface PortalAppointment {
  id:               string
  department:       string
  appointment_type: string
  status:           string
  scheduled_at:     string
  duration_minutes: number
  reason:           string | null
  channel:          string | null
  daily_room_url:   string | null
  physician_name:   string | null
}

export interface PortalCase {
  id:              string
  case_number:     string
  department:      string
  status:          string
  chief_complaint: string | null
  opened_at:       string
}

export interface PortalDiagnosis {
  id:           string
  icd10_code:   string
  description:  string
  severity:     string | null
  diagnosed_at: string
}

export interface PortalMessage {
  id:          string
  staff_id:    string
  staff_name:  string
  body:        string
  sender_type: 'patient' | 'staff'
  sent_at:     string
  read_at:     string | null
}

export interface PortalComplaint {
  id:           string
  subject:      string
  body:         string
  status:       string
  submitted_at: string
}

export interface PortalProfile {
  id:             string
  mrn:            string
  first_name:     string
  last_name:      string
  date_of_birth:  string
  gender:         string
  blood_group:    string | null
  genotype:       string | null
  height_cm:      number | null
  weight_kg:      number | null
  bmi:            number | null
  nationality:    string | null
  phone:          string | null
  email:          string | null
  address_line1:  string | null
  address_line2:  string | null
  city:           string | null
  state_province: string | null
  zip_postal:     string | null
  country:        string | null
}

export interface UpdateProfilePayload {
  nationality?:    string
  height_cm?:      number
  weight_kg?:      number
  phone?:          string
  email?:          string
  address_line1?:  string
  address_line2?:  string
  city?:           string
  state_province?: string
  zip_postal?:     string
  country?:        string
}

export const portalApi = {
  login: async (payload: PortalLoginPayload): Promise<PortalUser> => {
    const res = await apiClient.post<ApiResponse<PortalUser>>(
      '/portal/login', payload
    )
    return res.data.data!
  },

  setup: async (token: string, password: string): Promise<void> => {
    await apiClient.post('/portal/setup', { token, password })
  },

  me: async (): Promise<PortalMe> => {
    const res = await apiClient.get<ApiResponse<PortalMe>>('/portal/me')
    return res.data.data!
  },

  appointments: async (): Promise<PortalAppointment[]> => {
    const res = await apiClient.get<ApiResponse<PortalAppointment[]>>(
      '/portal/appointments'
    )
    return res.data.data ?? []
  },

  cases: async (): Promise<PortalCase[]> => {
    const res = await apiClient.get<ApiResponse<PortalCase[]>>('/portal/cases')
    return res.data.data ?? []
  },

  diagnoses: async (caseId: string): Promise<PortalDiagnosis[]> => {
    const res = await apiClient.get<ApiResponse<PortalDiagnosis[]>>(
      `/portal/cases/${caseId}/diagnoses`
    )
    return res.data.data ?? []
  },

  messages: async (): Promise<PortalMessage[]> => {
    const res = await apiClient.get<ApiResponse<PortalMessage[]>>(
      '/portal/messages'
    )
    return res.data.data ?? []
  },

  sendMessage: async (staff_id: string, body: string): Promise<PortalMessage> => {
    const res = await apiClient.post<ApiResponse<PortalMessage>>(
      '/portal/messages', { staff_id, body }
    )
    return res.data.data!
  },

  submitComplaint: async (subject: string, body: string): Promise<PortalComplaint> => {
    const res = await apiClient.post<ApiResponse<PortalComplaint>>(
      '/portal/complaints', { subject, body }
    )
    return res.data.data!
  },
staffSendMessage: async (patientId: string, body: string): Promise<void> => {
    await apiClient.post(`/patients/${patientId}/messages`, { body })
  },

  staffGetMessages: async (patientId: string): Promise<PortalMessage[]> => {
    const res = await apiClient.get<ApiResponse<PortalMessage[]>>(
      `/patients/${patientId}/messages`
    )
    return res.data.data ?? []
  },

  sendInvite: async (patientId: string, email: string): Promise<void> => {
    await apiClient.post(`/patients/${patientId}/invite`, { email })
  },

  getProfile: async (): Promise<PortalProfile> => {
    const res = await apiClient.get<ApiResponse<PortalProfile>>('/portal/profile')
    return res.data.data!
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<PortalProfile> => {
    const res = await apiClient.patch<ApiResponse<PortalProfile>>(
      '/portal/profile', payload
    )
    return res.data.data!
  },
}