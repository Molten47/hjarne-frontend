// src/api/portal.ts — mock implementation
import {
  db, delay,
  MOCK_PORTAL_CREDENTIALS,
  MOCK_PORTAL_ME,
  MOCK_PORTAL_APPOINTMENTS,
  MOCK_PORTAL_CASES,
  MOCK_PORTAL_DIAGNOSES,
} from '../mock/MockData'

// ── Re-export all types so nothing else needs to change ──────
export interface PortalLoginPayload { mrn: string; password: string }

export interface PortalUser {
  patient_id:    string
  mrn:           string
  first_name:    string
  last_name:     string
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

// ── API ───────────────────────────────────────────────────────
export const portalApi = {
  login: async (payload: PortalLoginPayload): Promise<PortalUser> => {
    await delay(400)
    const entry = MOCK_PORTAL_CREDENTIALS[payload.mrn]
    if (!entry || entry.password !== payload.password)
      throw new Error('Invalid MRN or password')
    return entry.user
  },

  setup: async (_token: string, _password: string): Promise<void> => {
    await delay(300)
  },

  me: async (): Promise<PortalMe> => {
    await delay()
    return { ...MOCK_PORTAL_ME }
  },

  appointments: async (): Promise<PortalAppointment[]> => {
    await delay()
    return [...MOCK_PORTAL_APPOINTMENTS]
  },

  cases: async (): Promise<PortalCase[]> => {
    await delay()
    return [...MOCK_PORTAL_CASES]
  },

  diagnoses: async (caseId: string): Promise<PortalDiagnosis[]> => {
    await delay()
    return MOCK_PORTAL_DIAGNOSES[caseId] ?? []
  },

  messages: async (): Promise<PortalMessage[]> => {
    await delay()
    return [...db.portalMessages]
  },

  sendMessage: async (_staff_id: string, body: string): Promise<PortalMessage> => {
    await delay(300)
    const msg: PortalMessage = {
      id:          'pm' + Date.now(),
      staff_id:    's2',
      staff_name:  'Dr. Aisha Nkrumah',
      body,
      sender_type: 'patient',
      sent_at:     new Date().toISOString(),
      read_at:     null,
    }
    db.portalMessages.push(msg)
    return msg
  },

  submitComplaint: async (subject: string, body: string): Promise<PortalComplaint> => {
    await delay(300)
    const complaint: PortalComplaint = {
      id:           'pc' + Date.now(),
      subject,
      body,
      status:       'submitted',
      submitted_at: new Date().toISOString(),
    }
    db.portalComplaints.push(complaint)
    return complaint
  },

  staffSendMessage: async (_patientId: string, body: string): Promise<void> => {
    await delay(300)
    db.portalMessages.push({
      id:          'pm' + Date.now(),
      staff_id:    's2',
      staff_name:  'Dr. Aisha Nkrumah',
      body,
      sender_type: 'staff',
      sent_at:     new Date().toISOString(),
      read_at:     null,
    })
  },

  staffGetMessages: async (_patientId: string): Promise<PortalMessage[]> => {
    await delay()
    return [...db.portalMessages]
  },

  sendInvite: async (_patientId: string, _email: string): Promise<void> => {
    await delay(300)
  },

  getProfile: async (): Promise<PortalProfile> => {
    await delay()
    return { ...db.portalProfile }
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<PortalProfile> => {
    await delay(300)
    Object.assign(db.portalProfile, payload)
    return { ...db.portalProfile }
  },
}