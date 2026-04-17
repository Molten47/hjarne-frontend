

import type {
  User, Patient, Staff, Appointment, CaseFile,
  Diagnosis, Prescription, PrescriptionItem,
  DrugStock, Notification, ClinicalComm, CaseAssignment,
} from '../types'
import type {
  PortalUser, PortalMe, PortalAppointment, PortalCase,
  PortalDiagnosis, PortalMessage, PortalComplaint, PortalProfile,
} from '../api/portal'



// ── Auth ────────────────────────────────────────────────────
export const MOCK_USERS: Record<string, { password: string; user: User; token: string }> = {
  'admin@hjarne.com': {
    password: 'password',
    token: 'mock-token-admin',
    user: { user_id: 'u1', entity_id: 's1', entity_type: 'staff', roles: ['admin'], department: 'Administration' },
  },
  'physician@hjarne.com': {
    password: 'password',
    token: 'mock-token-physician',
    user: { user_id: 'u2', entity_id: 's2', entity_type: 'staff', roles: ['physician'], department: 'General Medicine' },
  },
  'nurse@hjarne.com': {
    password: 'password',
    token: 'mock-token-nurse',
    user: { user_id: 'u3', entity_id: 's3', entity_type: 'staff', roles: ['nurse'], department: 'Cardiology' },
  },
  'pharmacist@hjarne.com': {
    password: 'password',
    token: 'mock-token-pharmacist',
    user: { user_id: 'u4', entity_id: 's4', entity_type: 'staff', roles: ['pharmacist'], department: 'Pharmacy' },
  },
  'surgeon@hjarne.com': {
  password: 'password',
  token: 'mock-token-surgeon',
  user: { user_id: 'u5', entity_id: 's5', entity_type: 'staff', roles: ['surgeon'], department: 'Surgery' },
},
}

// ── Patients ─────────────────────────────────────────────────
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1', mrn: 'MRN-001', first_name: 'Margaret', last_name: 'Sullivan',
    date_of_birth: '1978-06-14', gender: 'female', blood_group: 'O+',
    phone: '(312) 555-0147', email: 'margaret.sullivan@email.com',
    address: '2847 N Clark Street, Apt 3B, Chicago, IL 60657',
  },
  {
    id: 'p2', mrn: 'MRN-002', first_name: 'James', last_name: 'Whitfield',
    date_of_birth: '1965-11-03', gender: 'male', blood_group: 'A+',
    phone: '(713) 555-0234', email: 'j.whitfield@gmail.com',
    address: '4102 Westheimer Rd, Houston, TX 77027',
  },
  {
    id: 'p3', mrn: 'MRN-003', first_name: 'Denise', last_name: 'Carmichael',
    date_of_birth: '1989-04-22', gender: 'female', blood_group: 'B+',
    phone: '(404) 555-0391', email: 'denise.carmichael@outlook.com',
    address: '815 Peachtree St NE, Apt 12, Atlanta, GA 30308',
  },
  {
    id: 'p4', mrn: 'MRN-004', first_name: 'Raymond', last_name: 'Ochoa',
    date_of_birth: '1952-09-08', gender: 'male', blood_group: 'AB-',
    phone: '(602) 555-0478', email: 'raymond.ochoa@yahoo.com',
    address: '2230 E Camelback Rd, Phoenix, AZ 85016',
  },
  {
    id: 'p5', mrn: 'MRN-005', first_name: 'Brittany', last_name: 'Henson',
    date_of_birth: '1996-02-27', gender: 'female', blood_group: 'O-',
    phone: '(503) 555-0512', email: 'brittany.henson@gmail.com',
    address: '1648 NW 23rd Ave, Portland, OR 97210',
  },
  {
    id: 'p6', mrn: 'MRN-006', first_name: 'Gerald', last_name: 'Nakamura',
    date_of_birth: '1943-07-19', gender: 'male', blood_group: 'A-',
    phone: '(808) 555-0629', email: 'g.nakamura@hawaii.rr.com',
    address: '1122 Nuuanu Ave, Honolulu, HI 96817',
  },
  {
    id: 'p7', mrn: 'MRN-007', first_name: 'Tiffany', last_name: 'Okafor',
    date_of_birth: '1983-12-31', gender: 'female', blood_group: 'B-',
    phone: '(214) 555-0763', email: 'tiffany.okafor@email.com',
    address: '3901 Maple Ave, Suite 5, Dallas, TX 75219',
  },
  {
    id: 'p8', mrn: 'MRN-008', first_name: 'Douglas', last_name: 'Patterson',
    date_of_birth: '1971-05-16', gender: 'male', blood_group: 'O+',
    phone: '(206) 555-0884', email: 'doug.patterson@outlook.com',
    address: '742 Queen Anne Ave N, Seattle, WA 98109',
  },
]

// ── Staff ────────────────────────────────────────────────────
export const MOCK_STAFF: Staff[] = [
  {
    id: 's1', staff_code: 'STF-001', first_name: 'Patricia', last_name: 'Caldwell',
    role: 'admin', department: 'Administration', specialization: undefined,
    is_active: true, created_at: '2023-01-10T08:00:00Z', has_auth: true,
  },
  {
    id: 's2', staff_code: 'STF-002', first_name: 'Marcus', last_name: 'Reynolds',
    role: 'physician', department: 'General Medicine', specialization: 'Internal Medicine',
    is_active: true, created_at: '2023-02-14T08:00:00Z', has_auth: true,
  },
  {
    id: 's3', staff_code: 'STF-003', first_name: 'Sandra', last_name: 'Morales',
    role: 'nurse', department: 'Cardiology', specialization: undefined,
    is_active: true, created_at: '2023-03-01T08:00:00Z', has_auth: true,
  },
  {
    id: 's4', staff_code: 'STF-004', first_name: 'Kevin', last_name: 'Pham',
    role: 'pharmacist', department: 'Pharmacy', specialization: undefined,
    is_active: true, created_at: '2023-03-15T08:00:00Z', has_auth: true,
  },
  {
    id: 's5', staff_code: 'STF-005', first_name: 'Gregory', last_name: 'Abramowitz',
    role: 'surgeon', department: 'Surgery', specialization: 'Orthopedic Surgery',
    is_active: true, created_at: '2023-04-01T08:00:00Z', has_auth: true,
  },
  {
    id: 's6', staff_code: 'STF-006', first_name: 'Vanessa', last_name: 'Oduya',
    role: 'physician', department: 'Pediatrics', specialization: 'Pediatrics',
    is_active: true, created_at: '2023-04-20T08:00:00Z', has_auth: false,
  },
  {
    id: 's7', staff_code: 'STF-007', first_name: 'Anthony', last_name: 'Kowalski',
    role: 'nurse', department: 'Emergency', specialization: undefined,
    is_active: true, created_at: '2023-05-05T08:00:00Z', has_auth: true,
  },
  {
    id: 's8', staff_code: 'STF-008', first_name: 'Rebecca', last_name: 'Thornton',
    role: 'desk', department: 'Reception', specialization: undefined,
    is_active: false, created_at: '2023-06-01T08:00:00Z', has_auth: true,
  },
]

// ── Appointments ─────────────────────────────────────────────
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1', patient_id: 'p1', physician_id: 's2', department: 'General Medicine',
    appointment_type: 'consultation', status: 'scheduled',
    scheduled_at: '2026-04-18T09:00:00Z', duration_minutes: 30,
    reason: 'Annual wellness exam', channel: 'in-person',
    created_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'a2', patient_id: 'p2', physician_id: 's2', department: 'Cardiology',
    appointment_type: 'follow-up', status: 'confirmed',
    scheduled_at: '2026-04-18T10:30:00Z', duration_minutes: 45,
    reason: 'Blood pressure monitoring', channel: 'in-person',
    created_at: '2026-04-11T09:00:00Z',
  },
  {
    id: 'a3', patient_id: 'p3', physician_id: 's5', department: 'Surgery',
    appointment_type: 'pre-op', status: 'confirmed',
    scheduled_at: '2026-04-19T08:00:00Z', duration_minutes: 60,
    reason: 'Pre-operative assessment', channel: 'in-person',
    created_at: '2026-04-12T11:00:00Z',
  },
  {
    id: 'a4', patient_id: 'p4', physician_id: 's6', department: 'Pediatrics',
    appointment_type: 'consultation', status: 'completed',
    scheduled_at: '2026-04-15T14:00:00Z', duration_minutes: 30,
    reason: 'Child wellness visit', channel: 'in-person',
    created_at: '2026-04-13T08:00:00Z',
  },
  {
    id: 'a5', patient_id: 'p5', physician_id: 's2', department: 'General Medicine',
    appointment_type: 'telemedicine', status: 'scheduled',
    scheduled_at: '2026-04-20T11:00:00Z', duration_minutes: 20,
    reason: 'Medication follow-up', channel: 'telemedicine',
    daily_room_url: 'https://hjarne.daily.co/room-p5',
    created_at: '2026-04-14T10:00:00Z',
  },
  {
    id: 'a6', patient_id: 'p6', physician_id: 's5', department: 'Emergency',
    appointment_type: 'emergency', status: 'completed',
    scheduled_at: '2026-04-16T03:00:00Z', duration_minutes: 90,
    reason: 'Chest pain', channel: 'in-person',
    created_at: '2026-04-16T03:00:00Z',
  },
  {
    id: 'a7', patient_id: 'p7', physician_id: 's2', department: 'General Medicine',
    appointment_type: 'consultation', status: 'cancelled',
    scheduled_at: '2026-04-17T15:00:00Z', duration_minutes: 30,
    reason: 'Skin rash evaluation', channel: 'in-person',
    created_at: '2026-04-15T12:00:00Z',
  },
  {
    id: 'a8', patient_id: 'p8', physician_id: 's2', department: 'General Medicine',
    appointment_type: 'follow-up', status: 'no_show',
    scheduled_at: '2026-04-14T09:30:00Z', duration_minutes: 30,
    reason: 'Diabetes management', channel: 'in-person',
    created_at: '2026-04-10T08:00:00Z',
  },
]

// ── Cases ────────────────────────────────────────────────────
export const MOCK_CASES: CaseFile[] = [
  {
    id: 'c1', case_number: 'CASE-2026-001', patient_id: 'p1',
    primary_physician_id: 's2', department: 'General Medicine',
    status: 'open', admission_type: 'outpatient',
    chief_complaint: 'Persistent headache and dizziness',
    opened_at: '2026-04-10T08:00:00Z',
  },
  {
    id: 'c2', case_number: 'CASE-2026-002', patient_id: 'p2',
    primary_physician_id: 's2', department: 'Cardiology',
    status: 'open', admission_type: 'inpatient',
    chief_complaint: 'Irregular heartbeat and shortness of breath',
    opened_at: '2026-04-11T10:00:00Z', admitted_at: '2026-04-11T11:00:00Z',
  },
  {
    id: 'c3', case_number: 'CASE-2026-003', patient_id: 'p3',
    primary_physician_id: 's5', department: 'Surgery',
    status: 'open', admission_type: 'inpatient',
    chief_complaint: 'Acute appendicitis',
    opened_at: '2026-04-12T06:00:00Z', admitted_at: '2026-04-12T07:00:00Z',
  },
  {
    id: 'c4', case_number: 'CASE-2026-004', patient_id: 'p4',
    primary_physician_id: 's6', department: 'Pediatrics',
    status: 'closed', admission_type: 'outpatient',
    chief_complaint: 'Fever and cough',
    opened_at: '2026-04-08T09:00:00Z', closed_at: '2026-04-15T14:00:00Z',
  },
  {
    id: 'c5', case_number: 'CASE-2026-005', patient_id: 'p5',
    primary_physician_id: 's2', department: 'General Medicine',
    status: 'open', admission_type: 'outpatient',
    chief_complaint: 'Type 2 diabetes management review',
    opened_at: '2026-04-13T11:00:00Z',
  },
  {
    id: 'c6', case_number: 'CASE-2026-006', patient_id: 'p6',
    primary_physician_id: 's5', department: 'Emergency',
    status: 'discharged', admission_type: 'emergency',
    chief_complaint: 'Chest pain, ruled out MI',
    opened_at: '2026-04-16T03:00:00Z', discharged_at: '2026-04-16T18:00:00Z',
  },
  {
    id: 'c7', case_number: 'CASE-2026-007', patient_id: 'p7',
    primary_physician_id: 's2', department: 'Dermatology',
    status: 'open', admission_type: 'outpatient',
    chief_complaint: 'Recurring eczema flare-up',
    opened_at: '2026-04-14T13:00:00Z',
  },
  {
    id: 'c8', case_number: 'CASE-2026-008', patient_id: 'p8',
    primary_physician_id: 's2', department: 'General Medicine',
    status: 'open', admission_type: 'outpatient',
    chief_complaint: 'HbA1c review and medication adjustment',
    opened_at: '2026-04-15T09:00:00Z',
  },
]

// ── Diagnoses ────────────────────────────────────────────────
export const MOCK_DIAGNOSES: Record<string, Diagnosis[]> = {
  c1: [{ id: 'd1', case_file_id: 'c1', icd10_code: 'G43.9',  description: 'Migraine, unspecified',                          severity: 'moderate', diagnosed_at: '2026-04-10T09:00:00Z' }],
  c2: [{ id: 'd2', case_file_id: 'c2', icd10_code: 'I48.0',  description: 'Paroxysmal atrial fibrillation',                  severity: 'severe',   diagnosed_at: '2026-04-11T12:00:00Z' }],
  c3: [{ id: 'd3', case_file_id: 'c3', icd10_code: 'K35.80', description: 'Other and unspecified acute appendicitis',         severity: 'severe',   diagnosed_at: '2026-04-12T07:30:00Z' }],
  c4: [{ id: 'd4', case_file_id: 'c4', icd10_code: 'J06.9',  description: 'Acute upper respiratory infection, unspecified',   severity: 'mild',     diagnosed_at: '2026-04-08T10:00:00Z' }],
  c5: [{ id: 'd5', case_file_id: 'c5', icd10_code: 'E11.9',  description: 'Type 2 diabetes mellitus without complications',   severity: 'moderate', diagnosed_at: '2026-04-13T12:00:00Z' }],
  c7: [{ id: 'd6', case_file_id: 'c7', icd10_code: 'L20.9',  description: 'Atopic dermatitis, unspecified',                  severity: 'mild',     diagnosed_at: '2026-04-14T14:00:00Z' }],
  c8: [{ id: 'd7', case_file_id: 'c8', icd10_code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia',     severity: 'moderate', diagnosed_at: '2026-04-15T10:00:00Z' }],
}

// ── Clinical Comms ────────────────────────────────────────────
export const MOCK_COMMS: Record<string, ClinicalComm[]> = {
  c1: [
    {
      id: 'cc1', case_file_id: 'c1', comm_type: 'note',
      subject: 'Initial assessment note',
      body: 'Patient presents with a 3-day history of throbbing headache. No neurological deficits on exam. MRI brain ordered. Started on ibuprofen 400mg PRN.',
      status: 'read', created_at: '2026-04-10T09:30:00Z',
      sender: { id: 's2', first_name: 'Marcus', last_name: 'Reynolds', role: 'physician' },
      attachments: [],
    },
  ],
  c2: [
    {
      id: 'cc2', case_file_id: 'c2', comm_type: 'handoff',
      subject: 'Night handoff — Cardiology',
      body: 'Patient stable on telemetry. Rate controlled at 72 bpm. Continue metoprolol 25mg BID. Follow-up echo scheduled for tomorrow morning.',
      status: 'sent', created_at: '2026-04-11T22:00:00Z',
      sender: { id: 's3', first_name: 'Sandra', last_name: 'Morales', role: 'nurse' },
      attachments: [],
    },
  ],
  c3: [
    {
      id: 'cc3', case_file_id: 'c3', comm_type: 'note',
      subject: 'Pre-op checklist complete',
      body: 'Patient consented for laparoscopic appendectomy. NPO since midnight. IV access x2, type and screen sent. OR slot confirmed for 0800.',
      status: 'read', created_at: '2026-04-12T22:00:00Z',
      sender: { id: 's5', first_name: 'Gregory', last_name: 'Abramowitz', role: 'surgeon' },
      attachments: [],
    },
  ],
}

// ── Assignments ───────────────────────────────────────────────
export const MOCK_ASSIGNMENTS: Record<string, CaseAssignment[]> = {
  c1: [
    { id: 'ca1', staff_id: 's2', first_name: 'Marcus', last_name: 'Reynolds', role: 'physician', assigned_at: '2026-04-10T08:05:00Z' },
  ],
  c2: [
    { id: 'ca2', staff_id: 's2', first_name: 'Marcus', last_name: 'Reynolds', role: 'physician', assigned_at: '2026-04-11T10:05:00Z' },
    { id: 'ca3', staff_id: 's3', first_name: 'Sandra', last_name: 'Morales',  role: 'nurse',     assigned_at: '2026-04-11T11:00:00Z' },
  ],
  c3: [
    { id: 'ca4', staff_id: 's5', first_name: 'Gregory', last_name: 'Abramowitz', role: 'surgeon', assigned_at: '2026-04-12T06:05:00Z' },
    { id: 'ca5', staff_id: 's7', first_name: 'Anthony', last_name: 'Kowalski',   role: 'nurse',   assigned_at: '2026-04-12T07:00:00Z' },
  ],
  c5: [
    { id: 'ca6', staff_id: 's2', first_name: 'Marcus', last_name: 'Reynolds', role: 'physician', assigned_at: '2026-04-13T11:05:00Z' },
  ],
}

// ── Drug Stock ────────────────────────────────────────────────
export const MOCK_DRUG_STOCK: DrugStock[] = [
  { drug_id: 'dr1', name: 'Amoxicillin 500mg',       category: 'Antibiotic',       unit: 'capsule', quantity_on_hand: 240, reorder_threshold: 50,  is_low: false },
  { drug_id: 'dr2', name: 'Metformin 850mg',          category: 'Antidiabetic',     unit: 'tablet',  quantity_on_hand: 28,  reorder_threshold: 60,  is_low: true  },
  { drug_id: 'dr3', name: 'Amlodipine 5mg',           category: 'Antihypertensive', unit: 'tablet',  quantity_on_hand: 180, reorder_threshold: 40,  is_low: false },
  { drug_id: 'dr4', name: 'Atorvastatin 40mg',        category: 'Statin',           unit: 'tablet',  quantity_on_hand: 120, reorder_threshold: 30,  is_low: false },
  { drug_id: 'dr5', name: 'Omeprazole 20mg',          category: 'PPI',              unit: 'capsule', quantity_on_hand: 18,  reorder_threshold: 50,  is_low: true  },
  { drug_id: 'dr6', name: 'Acetaminophen 500mg',      category: 'Analgesic',        unit: 'tablet',  quantity_on_hand: 600, reorder_threshold: 100, is_low: false },
  { drug_id: 'dr7', name: 'Lisinopril 10mg',          category: 'ACE Inhibitor',    unit: 'tablet',  quantity_on_hand: 90,  reorder_threshold: 40,  is_low: false },
  { drug_id: 'dr8', name: 'Warfarin 5mg',             category: 'Anticoagulant',    unit: 'tablet',  quantity_on_hand: 14,  reorder_threshold: 30,  is_low: true  },
  { drug_id: 'dr9', name: 'Metoprolol Succinate 25mg',category: 'Beta-Blocker',     unit: 'tablet',  quantity_on_hand: 75,  reorder_threshold: 30,  is_low: false },
  { drug_id: 'dr10',name: 'Ibuprofen 400mg',          category: 'NSAID',            unit: 'tablet',  quantity_on_hand: 320, reorder_threshold: 80,  is_low: false },
]

// ── Prescriptions ─────────────────────────────────────────────
const MOCK_ITEMS: PrescriptionItem[] = [
  {
    id: 'pi1', drug_id: 'dr1', drug_name: 'Amoxicillin 500mg',
    dosage: '500mg', frequency: 'TID', route: 'oral', duration_days: 7,
    instructions: 'Take with food. Complete full course.',
    contraindication_flagged: false, is_controlled: false,
  },
  {
    id: 'pi2', drug_id: 'dr2', drug_name: 'Metformin 850mg',
    dosage: '850mg', frequency: 'BID', route: 'oral', duration_days: 30,
    instructions: 'Take with meals to reduce GI upset.',
    contraindication_flagged: false, is_controlled: false,
  },
  {
    id: 'pi3', drug_id: 'dr3', drug_name: 'Amlodipine 5mg',
    dosage: '5mg', frequency: 'QD', route: 'oral', duration_days: 30,
    instructions: 'Take at the same time each day.',
    contraindication_flagged: false, is_controlled: false,
  },
  {
    id: 'pi4', drug_id: 'dr9', drug_name: 'Metoprolol Succinate 25mg',
    dosage: '25mg', frequency: 'BID', route: 'oral', duration_days: 30,
    instructions: 'Do not stop abruptly. Monitor heart rate.',
    contraindication_flagged: false, is_controlled: false,
  },
]

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx1', case_file_id: 'c5', prescribed_by: 's2',
    status: 'pending', prescribed_at: '2026-04-13T13:00:00Z',
    physician_approved: false, ai_confidence: 0.93,
    ai_recommendation: 'Metformin is first-line for T2DM. Monitor eGFR before initiating. Consider A1C recheck in 3 months.',
    items: [MOCK_ITEMS[1]],
  },
  {
    id: 'rx2', case_file_id: 'c1', prescribed_by: 's2',
    status: 'approved', prescribed_at: '2026-04-10T10:00:00Z',
    physician_approved: true, items: [MOCK_ITEMS[0]],
  },
  {
    id: 'rx3', case_file_id: 'c2', prescribed_by: 's2',
    status: 'dispensed', prescribed_at: '2026-04-11T13:00:00Z',
    physician_approved: true, items: [MOCK_ITEMS[2], MOCK_ITEMS[3]],
  },
]

// ── Notifications ─────────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', event_type: 'appointment.scheduled', payload: { patient: 'Margaret Sullivan', time: '09:00 AM' },  status: 'delivered', created_at: '2026-04-17T07:00:00Z' },
  { id: 'n2', event_type: 'prescription.pending',  payload: { patient: 'Brittany Henson', rx_id: 'rx1' },        status: 'delivered', created_at: '2026-04-17T07:30:00Z' },
  { id: 'n3', event_type: 'case.opened',           payload: { case_number: 'CASE-2026-008' },                    status: 'read',      created_at: '2026-04-15T09:05:00Z', read_at: '2026-04-15T09:10:00Z' },
  { id: 'n4', event_type: 'drug.low_stock',        payload: { drug: 'Metformin 850mg', qty: 28 },                status: 'delivered', created_at: '2026-04-16T08:00:00Z' },
  { id: 'n5', event_type: 'drug.low_stock',        payload: { drug: 'Warfarin 5mg', qty: 14 },                   status: 'delivered', created_at: '2026-04-16T08:01:00Z' },
]

// ── Portal ────────────────────────────────────────────────────
export const MOCK_PORTAL_CREDENTIALS: Record<string, { password: string; user: PortalUser }> = {
  'MRN-001': {
    password: 'patient123',
    user: {
      patient_id: 'p1', mrn: 'MRN-001', first_name: 'Margaret', last_name: 'Sullivan',
      access_token: 'mock-portal-token-p1', refresh_token: 'mock-portal-refresh-p1', expires_in: 3600,
    },
  },
}

export const MOCK_PORTAL_ME: PortalMe = {
  id: 'p1', mrn: 'MRN-001', first_name: 'Margaret', last_name: 'Sullivan',
  date_of_birth: '1978-06-14', gender: 'female', blood_group: 'O+',
}

export const MOCK_PORTAL_APPOINTMENTS: PortalAppointment[] = [
  {
    id: 'a1', department: 'General Medicine', appointment_type: 'consultation',
    status: 'scheduled', scheduled_at: '2026-04-18T09:00:00Z', duration_minutes: 30,
    reason: 'Annual wellness exam', channel: 'in-person',
    daily_room_url: null, physician_name: 'Dr. Marcus Reynolds',
  },
  {
    id: 'a5', department: 'General Medicine', appointment_type: 'telemedicine',
    status: 'scheduled', scheduled_at: '2026-04-20T11:00:00Z', duration_minutes: 20,
    reason: 'Medication follow-up', channel: 'telemedicine',
    daily_room_url: 'https://hjarne.daily.co/room-p5', physician_name: 'Dr. Marcus Reynolds',
  },
]

export const MOCK_PORTAL_CASES: PortalCase[] = [
  {
    id: 'c1', case_number: 'CASE-2026-001', department: 'General Medicine',
    status: 'open', chief_complaint: 'Persistent headache and dizziness',
    opened_at: '2026-04-10T08:00:00Z',
  },
]

export const MOCK_PORTAL_DIAGNOSES: Record<string, PortalDiagnosis[]> = {
  c1: [{ id: 'd1', icd10_code: 'G43.9', description: 'Migraine, unspecified', severity: 'moderate', diagnosed_at: '2026-04-10T09:00:00Z' }],
}

export const MOCK_PORTAL_MESSAGES: PortalMessage[] = [
  {
    id: 'pm1', staff_id: 's2', staff_name: 'Dr. Marcus Reynolds',
    body: 'Hello Margaret, your MRI results came back normal. Please continue with the prescribed ibuprofen as needed and follow up in 2 weeks if symptoms persist.',
    sender_type: 'staff', sent_at: '2026-04-11T10:00:00Z', read_at: '2026-04-11T10:45:00Z',
  },
  {
    id: 'pm2', staff_id: 's2', staff_name: 'Dr. Marcus Reynolds',
    body: 'Thank you, Dr. Reynolds. Should I avoid any specific activities or foods?',
    sender_type: 'patient', sent_at: '2026-04-11T11:00:00Z', read_at: null,
  },
]

export const MOCK_PORTAL_COMPLAINTS: PortalComplaint[] = [
  {
    id: 'pc1', subject: 'Extended wait time in waiting room',
    body: 'I waited over 90 minutes past my scheduled appointment on April 8th without any update from staff.',
    status: 'under_review', submitted_at: '2026-04-09T14:00:00Z',
  },
]

export const MOCK_PORTAL_PROFILE: PortalProfile = {
  id: 'p1',
  mrn: 'MRN-001',
  first_name: 'Margaret',
  last_name: 'Sullivan',
  date_of_birth: '1978-06-14',
  gender: 'female',
  blood_group: 'O+',
  genotype: 'AA',
  height_cm: 168,   // 5′6″
  weight_kg: 68,    // ~150 lbs
  bmi: 24.1,
  nationality: 'American',
  phone: '(312) 555-0147',
  email: 'margaret.sullivan@email.com',
  address_line1: '2847 N Clark Street',
  address_line2: 'Apt 3B',
  city: 'Chicago',
  state_province: 'IL',
  zip_postal: '60657',
  country: 'USA',
}

// ── In-memory mutable state (simulates DB mutations) ──────────
export const db = {
  patients:         [...MOCK_PATIENTS]       as Patient[],
  staff:            [...MOCK_STAFF]          as Staff[],
  appointments:     [...MOCK_APPOINTMENTS]   as Appointment[],
  cases:            [...MOCK_CASES]          as CaseFile[],
  diagnoses:        { ...MOCK_DIAGNOSES }    as Record<string, Diagnosis[]>,
  comms:            { ...MOCK_COMMS }        as Record<string, ClinicalComm[]>,
  assignments:      { ...MOCK_ASSIGNMENTS }  as Record<string, CaseAssignment[]>,
  prescriptions:    [...MOCK_PRESCRIPTIONS]  as Prescription[],
  drugStock:        [...MOCK_DRUG_STOCK]     as DrugStock[],
  notifications:    [...MOCK_NOTIFICATIONS]  as Notification[],
  portalMessages:   [...MOCK_PORTAL_MESSAGES]    as PortalMessage[],
  portalComplaints: [...MOCK_PORTAL_COMPLAINTS]  as PortalComplaint[],
  portalProfile:    { ...MOCK_PORTAL_PROFILE }   as PortalProfile,
}

// Tiny helper — simulate async network delay
export const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))