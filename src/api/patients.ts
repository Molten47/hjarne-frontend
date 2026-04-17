// src/api/patients.ts — mock implementation
import { db, delay, MOCK_PORTAL_CREDENTIALS } from '../mock/MockData'
import { getScopedPatients } from '../mock/scopeData'
import type { Patient } from '../types'


export interface CreatePatientPayload {
  first_name:    string
  last_name:     string
  date_of_birth: string
  gender:        string
  blood_group?:  string
  genotype?:     string
  height_cm?:    number
  weight_kg?:    number
  nationality?:  string
  phone?:        string   // ← add
  email?:        string   // ← add
  address?:      string   // ← add
}

export const patientsApi = {
  list: async (q?: string, _limit = 25, _cursor?: string) => {
    await delay()
    let data = [...getScopedPatients()]           // ← swapped from db.patients
    if (q) {
      const lq = q.toLowerCase()
      data = data.filter(p =>
        p.first_name.toLowerCase().includes(lq) ||
        p.last_name.toLowerCase().includes(lq) ||
        p.mrn.toLowerCase().includes(lq)
      )
    }
    return { data, next_cursor: null }
  },


  // src/api/patients.ts — add this to get()
get: async (id: string): Promise<Patient & {
  phone: string | null
  email: string | null
  address: string | null
  portal_active: boolean
}> => {
  await delay()
  const p = db.patients.find(p => p.id === id)
  if (!p) throw new Error('Patient not found')

  return {
    ...p,
    phone:        (p as any).phone   ?? null,
    email:        (p as any).email   ?? null,
    address:      (p as any).address ?? null,
    portal_active: id === 'p1',
  }
},

create: async (payload: CreatePatientPayload): Promise<Patient> => {
  await delay(400)
  const newPatient: Patient = {
    id:            'p' + Date.now(),
    mrn:           'MRN-' + String(db.patients.length + 1).padStart(3, '0'),
    first_name:    payload.first_name,
    last_name:     payload.last_name,
    date_of_birth: payload.date_of_birth,
    gender:        payload.gender,
    blood_group:   payload.blood_group,
    phone:         payload.phone  ?? null,
    email:         payload.email  ?? null,
    address:       payload.address ?? null,
  }

  db.patients.unshift(newPatient)

  // ── Mock the invite → password-set flow ──────────────────
  // In prod: email goes out, patient clicks link, sets password.
  // Here: credentials are auto-created so you can log in immediately
  // as the new patient using MRN + 'patient123' (default mock password).
  MOCK_PORTAL_CREDENTIALS[newPatient.mrn] = {
    password: 'patient123',
    user: {
      patient_id:    newPatient.id,
      mrn:           newPatient.mrn,
      first_name:    newPatient.first_name,
      last_name:     newPatient.last_name,
      access_token:  'mock-portal-token-' + newPatient.id,
      refresh_token: 'mock-portal-refresh-' + newPatient.id,
      expires_in:    3600,
    },
  }

  return newPatient
},
}