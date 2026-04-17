// src/api/notifications.ts — mock implementation
import { db, delay } from '../mock/MockData'
import type { Notification } from '../types'

// ── Role-aware notification filter ───────────────────────────
// Each role has a set of event_types that are relevant to them.
// Admin sees everything. Physician sees clinical events.
// Pharmacist sees drug/prescription events. Nurse sees clinical events.
// Falls back to all notifications for unrecognised roles.

const ROLE_EVENT_MAP: Record<string, string[]> = {
  admin:      [], // empty = show all
  physician:  [
    'appointment.scheduled',
    'appointment.confirmed',
    'appointment.cancelled',
    'case.opened',
    'case.updated',
    'prescription.pending',
    'prescription.approved',
  ],
  nurse:      [
    'appointment.scheduled',
    'appointment.confirmed',
    'case.opened',
    'case.updated',
  ],
  pharmacist: [
    'prescription.pending',
    'prescription.approved',
    'prescription.dispensed',
    'drug.low_stock',
  ],
}

function getScopedNotifications(): Notification[] {
  try {
    const raw  = localStorage.getItem('hjarne_user')
    if (!raw) return db.notifications

    const user = JSON.parse(raw) as { roles: string[] }
    const role = user.roles?.[0]

    // Admin or unknown role → see everything
    if (!role || role === 'admin' || !(role in ROLE_EVENT_MAP)) {
      return db.notifications
    }

    const allowed = ROLE_EVENT_MAP[role]
    return db.notifications.filter(n => allowed.includes(n.event_type))
  } catch {
    return db.notifications
  }
}

export const notificationsApi = {
  list: async (): Promise<Notification[]> => {
    await delay()
    return [...getScopedNotifications()]                     // ← was db.notifications
  },

  markRead: async (ids: string[]): Promise<void> => {
    await delay(200)
    db.notifications.forEach(n => {                          // mutations always go to db
      if (ids.includes(n.id)) {
        n.status  = 'read'
        n.read_at = new Date().toISOString()
      }
    })
  },
}