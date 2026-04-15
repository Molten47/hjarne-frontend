export interface User {
  user_id: string
  entity_id: string
  entity_type: 'staff' | 'patient'
  roles: Role[]
  department?: string
}

export type Role =
  | 'admin'
  | 'physician'
  | 'surgeon'
  | 'nurse'
  | 'pharmacist'
  | 'desk'
  | 'patient'


  export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  must_change_password: boolean
  user: User
}

export interface Patient {
  id: string
  mrn: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  blood_group?: string
}

export interface Staff {
  id: string
  staff_code: string
  first_name: string
  last_name: string
  role: string
  department?: string
  specialization?: string
  is_active: boolean
  created_at: string
  has_auth: boolean
}

export interface Appointment {
  id: string
  patient_id: string
  physician_id?: string
  department: string
  appointment_type: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  scheduled_at: string
  duration_minutes: number
  reason?: string
  channel?: string
  daily_room_url?: string
  created_at: string
}

export interface CaseFile {
  id: string
  case_number: string
  patient_id: string
  primary_physician_id?: string
  department: string
  status: 'open' | 'closed' | 'discharged'
  admission_type?: string
  admitted_at?: string
  discharged_at?: string
  chief_complaint?: string
  opened_at: string
  closed_at?: string
}

export interface Diagnosis {
  id: string
  case_file_id: string
  icd10_code: string
  description: string
  severity?: string
  diagnosed_at: string
}

export interface PrescriptionItem {
  id: string
  drug_id: string
  drug_name: string
  generic_name?: string
  dosage: string
  frequency: string
  route: string
  duration_days?: number
  instructions?: string
  contraindication_flagged: boolean
  is_controlled: boolean
}

export interface Prescription {
  id: string
  case_file_id: string
  prescribed_by: string
  status: 'pending' | 'approved' | 'dispensed' | 'cancelled'
  prescribed_at: string
  physician_approved: boolean
  ai_confidence?: number
  ai_recommendation?: string
  items: PrescriptionItem[]
}

export interface DrugStock {
  drug_id: string
  name: string
  category?: string
  unit?: string
  quantity_on_hand: number
  reorder_threshold: number
  is_low: boolean
}
export interface Notification {
  id: string
  event_type: string
  payload: Record<string, unknown>
  status: string
  created_at: string
  read_at?: string
}

// API envelope shapes
export interface ApiResponse<T> {
  data: T | null
  meta?: {
    page?: number
    total?: number
    next_cursor?: string
  }
  error?: {
    code: string
    message: string
  }
}

export interface CommSender {
  id: string
  first_name: string
  last_name: string
  role: string
}

export interface AttachmentMeta {
  id: string
  file_name: string
  file_type: string
  file_size: number
  uploaded_at: string
}

export interface ClinicalComm {
  id: string
  case_file_id: string
  comm_type: 'note' | 'handoff' | 'upload'
  subject: string
  body: string
  status: 'sent' | 'read' | 'acknowledged'
  created_at: string
  sender: CommSender
  attachments: AttachmentMeta[]
}
export interface CaseAssignment {
  id: string
  staff_id: string
  first_name: string
  last_name: string
  role: string
  assigned_at: string
}

export interface CursorMeta {
  next_cursor?: string | null
}

export interface PagedResponse<T> {
  data: T[]
  meta?: CursorMeta
}