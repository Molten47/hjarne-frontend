
import { db, delay } from '../mock/MockData'
import { getScopedAppointments } from '../mock/scopeData'
import type { Appointment } from '../types'

export interface CreateAppointmentPayload {
  patient_id:        string
  physician_id?:     string
  department:        string
  appointment_type:  string
  scheduled_at:      string
  duration_minutes?: number
  reason?:           string
  channel?:          string
}

export interface AppointmentFilters {
  patient_id?: string
  status?:     string
}

export const appointmentsApi = {
  list: async (filters?: AppointmentFilters, _cursor?: string) => {
    await delay()
    let data = [...getScopedAppointments()]                            // ← was db.appointments
    if (filters?.patient_id) data = data.filter(a => a.patient_id === filters.patient_id)
    if (filters?.status)     data = data.filter(a => a.status     === filters.status)
    return { data, next_cursor: null }
  },

  create: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    await delay(400)
    const appt: Appointment = {
      id:               'a' + Date.now(),
      patient_id:       payload.patient_id,
      physician_id:     payload.physician_id,
      department:       payload.department,
      appointment_type: payload.appointment_type,
      status:           'scheduled',
      scheduled_at:     payload.scheduled_at,
      duration_minutes: payload.duration_minutes ?? 30,
      reason:           payload.reason,
      channel:          payload.channel,
      created_at:       new Date().toISOString(),
    }
    db.appointments.unshift(appt)                                      // mutations always go to db
    return appt
  },

  updateStatus: async (id: string, status: string, _notes?: string): Promise<Appointment> => {
    await delay(300)
    const appt = db.appointments.find(a => a.id === id)               // single lookups stay on db
    if (!appt) throw new Error('Appointment not found')
    appt.status = status as Appointment['status']
    return appt
  },
}