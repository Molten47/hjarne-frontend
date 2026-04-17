// src/api/cases.ts — mock implementation
import { db, delay } from '../mock/MockData'
import { getScopedCases } from '../mock/scopeData'
import type { CaseFile, Diagnosis } from '../types'
import type { ClinicalComm, CaseAssignment } from '@/types'

export const casesApi = {
  list: async (status?: string, _cursor?: string) => {
    await delay()
    let data = [...getScopedCases()]                          // ← was db.cases
    if (status) data = data.filter(c => c.status === status)
    return { data, next_cursor: null }
  },

  open: async (payload: {
    patient_id:       string
    physician_id?:    string
    department:       string
    admission_type?:  string
    chief_complaint?: string
  }): Promise<CaseFile> => {
    await delay(400)
    const num = String(db.cases.length + 1).padStart(3, '0')
    const newCase: CaseFile = {
      id:                   'c' + Date.now(),
      case_number:          `CASE-2026-${num}`,
      patient_id:           payload.patient_id,
      primary_physician_id: payload.physician_id,
      department:           payload.department,
      status:               'open',
      admission_type:       payload.admission_type,
      chief_complaint:      payload.chief_complaint,
      opened_at:            new Date().toISOString(),
    }
    db.cases.unshift(newCase)                                 // mutations always go to db
    return newCase
  },

  get: async (id: string): Promise<CaseFile> => {
    await delay()
    const c = db.cases.find(c => c.id === id)                // single lookups stay on db
    if (!c) throw new Error('Case not found')
    return c
  },

  updateStatus: async (id: string, status: string, _notes?: string): Promise<CaseFile> => {
    await delay(300)
    const c = db.cases.find(c => c.id === id)
    if (!c) throw new Error('Case not found')
    c.status = status as CaseFile['status']
    if (status === 'discharged') c.discharged_at = new Date().toISOString()
    if (status === 'closed')     c.closed_at     = new Date().toISOString()
    return c
  },

  addDiagnosis: async (caseId: string, payload: {
    icd10_code:  string
    description: string
    severity?:   string
    notes?:      string
  }): Promise<Diagnosis> => {
    await delay(300)
    const diag: Diagnosis = {
      id:           'd' + Date.now(),
      case_file_id: caseId,
      icd10_code:   payload.icd10_code,
      description:  payload.description,
      severity:     payload.severity,
      diagnosed_at: new Date().toISOString(),
    }
    if (!db.diagnoses[caseId]) db.diagnoses[caseId] = []
    db.diagnoses[caseId].push(diag)
    return diag
  },

  listComms: async (caseId: string): Promise<ClinicalComm[]> => {
    await delay()
    return db.comms[caseId] ?? []
  },

  sendComm: async (caseId: string, payload: {
    recipient_id?: string
    comm_type:     'note' | 'handoff' | 'upload'
    subject:       string
    body:          string
  }): Promise<ClinicalComm> => {
    await delay(300)
    const comm: ClinicalComm = {
      id:           'cc' + Date.now(),
      case_file_id: caseId,
      comm_type:    payload.comm_type,
      subject:      payload.subject,
      body:         payload.body,
      status:       'sent',
      created_at:   new Date().toISOString(),
      sender:       { id: 's2', first_name: 'Aisha', last_name: 'Nkrumah', role: 'physician' },
      attachments:  [],
    }
    if (!db.comms[caseId]) db.comms[caseId] = []
    db.comms[caseId].push(comm)
    return comm
  },

  markCommRead: async (_commId: string) => { await delay(100) },

  uploadAttachment: async (_commId: string, _file: File) => { await delay(500) },

  getAttachmentUrl: (_attachmentId: string) => '#',

  listAssignments: async (caseId: string): Promise<CaseAssignment[]> => {
    await delay()
    return db.assignments[caseId] ?? []
  },

  assignStaff: async (caseId: string, staff_id: string): Promise<CaseAssignment> => {
    await delay(300)
    const s = db.staff.find(s => s.id === staff_id)
    if (!s) throw new Error('Staff not found')
    const assignment: CaseAssignment = {
      id:          'ca' + Date.now(),
      staff_id,
      first_name:  s.first_name,
      last_name:   s.last_name,
      role:        s.role,
      assigned_at: new Date().toISOString(),
    }
    if (!db.assignments[caseId]) db.assignments[caseId] = []
    db.assignments[caseId].push(assignment)
    return assignment
  },
}