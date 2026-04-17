// src/api/staff.ts — mock implementation
import { db, delay } from '../mock/MockData'
import type { Staff } from '../types'

export const staffApi = {
  list: async (filters?: { role?: string; department?: string }): Promise<Staff[]> => {
    await delay()
    let data = [...db.staff]
    if (filters?.role)       data = data.filter(s => s.role       === filters.role)
    if (filters?.department) data = data.filter(s => s.department === filters.department)
    return data
  },

  create: async (payload: {
    first_name:      string
    last_name:       string
    role:            string
    department?:     string
    specialization?: string
    license_number?: string
  }): Promise<Staff> => {
    await delay(400)
    const s: Staff = {
      id:             's' + Date.now(),
      staff_code:     'STF-' + String(db.staff.length + 1).padStart(3, '0'),
      first_name:     payload.first_name,
      last_name:      payload.last_name,
      role:           payload.role,
      department:     payload.department,
      specialization: payload.specialization,
      is_active:      true,
      created_at:     new Date().toISOString(),
      has_auth:       false,
    }
    db.staff.push(s)
    return s
  },

  get: async (id: string): Promise<Staff> => {
    await delay()
    const s = db.staff.find(s => s.id === id)
    if (!s) throw new Error('Staff not found')
    return s
  },

  createAuth: async (staffId: string, _email: string, _password: string): Promise<void> => {
    await delay(300)
    const s = db.staff.find(s => s.id === staffId)
    if (s) s.has_auth = true
  },
}