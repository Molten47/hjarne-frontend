import { db } from './MockData'
import type { User } from '../types'

// ── Get the current logged-in user from localStorage ─────────
function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem('hjarne_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function isAdmin(user: User): boolean {
  return user.roles.includes('admin')
}

function isPhysician(user: User): boolean {
  return user.roles.includes('physician')
}

function isSurgeon(user: User): boolean {
  return user.roles.includes('surgeon')
}

function isNurse(user: User): boolean {
  return user.roles.includes('nurse')
}

// Physicians and surgeons share the same ID-based scoping logic —
// both are primary_physician_id owners on cases/appointments.
function isPhysicianOrSurgeon(user: User): boolean {
  return isPhysician(user) || isSurgeon(user)
}

// ── Scoped Cases ──────────────────────────────────────────────
export function getScopedCases() {
  const user = getCurrentUser()
  if (!user || isAdmin(user)) return db.cases

  if (isPhysicianOrSurgeon(user)) {
    return db.cases.filter(c => c.primary_physician_id === user.entity_id)
  }

  if (isNurse(user)) {
    // Nurse sees cases in their own department
    return db.cases.filter(c => c.department === user.department)
  }

  return db.cases
}

// ── Scoped Appointments ───────────────────────────────────────
export function getScopedAppointments() {
  const user = getCurrentUser()
  if (!user || isAdmin(user)) return db.appointments

  if (isPhysicianOrSurgeon(user)) {
    return db.appointments.filter(a => a.physician_id === user.entity_id)
  }

  if (isNurse(user)) {
    // Nurse sees appointments in their own department
    return db.appointments.filter(a => a.department === user.department)
  }

  return db.appointments
}

// ── Scoped Patients ───────────────────────────────────────────
export function getScopedPatients() {
  const user = getCurrentUser()
  if (!user || isAdmin(user)) return db.patients

  if (isPhysicianOrSurgeon(user)) {
    const patientIds = new Set(
      db.cases
        .filter(c => c.primary_physician_id === user.entity_id)
        .map(c => c.patient_id)
    )
    return db.patients.filter(p => patientIds.has(p.id))
  }

  if (isNurse(user)) {
    // Nurse sees patients who have at least one case in their department
    const patientIds = new Set(
      db.cases
        .filter(c => c.department === user.department)
        .map(c => c.patient_id)
    )
    return db.patients.filter(p => patientIds.has(p.id))
  }

  return db.patients
}

// ── Scoped Prescriptions ──────────────────────────────────────
export function getScopedPrescriptions() {
  const user = getCurrentUser()
  if (!user || isAdmin(user)) return db.prescriptions

  if (isPhysicianOrSurgeon(user)) {
    return db.prescriptions.filter(rx => rx.prescribed_by === user.entity_id)
  }

  if (isNurse(user)) {
    // Nurse sees prescriptions tied to cases in their department
    const caseIds = new Set(
      db.cases
        .filter(c => c.department === user.department)
        .map(c => c.id)
    )
    return db.prescriptions.filter(rx => caseIds.has(rx.case_file_id))
  }

  return db.prescriptions
}

// ── Scoped Notifications ──────────────────────────────────────
const ROLE_EVENT_MAP: Record<string, string[]> = {
  physician: ['appointment.scheduled', 'appointment.cancelled', 'case.opened', 'case.closed', 'prescription.pending', 'prescription.approved'],
  surgeon:   ['appointment.scheduled', 'appointment.cancelled', 'case.opened', 'case.closed', 'prescription.pending', 'prescription.approved'],
  nurse:     ['appointment.scheduled', 'appointment.cancelled', 'case.opened', 'case.assigned', 'case.handoff'],
  pharmacist:['prescription.pending', 'prescription.approved', 'drug.low_stock', 'drug.dispensed'],
}

export function getScopedNotifications() {
  const user = getCurrentUser()
  if (!user || isAdmin(user)) return db.notifications

  const role = user.roles[0]
  const allowed = ROLE_EVENT_MAP[role]
  if (!allowed) return db.notifications

  return db.notifications.filter(n => allowed.includes(n.event_type))
}