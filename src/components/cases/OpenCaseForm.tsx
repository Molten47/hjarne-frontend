import { useState }   from 'react'
import { X, Loader2 } from 'lucide-react'
import { useOpenCase } from '@/hooks/useCases'
import type { Patient, Staff } from '@/types'

interface Props {
  open:       boolean
  onClose:    () => void
  patients:   Patient[]
  physicians: Staff[]
}

const INITIAL = {
  patient_id: '', physician_id: '', department: '',
  admission_type: '', chief_complaint: '',
}

const DEPARTMENTS   = ['consultation','maternity','surgery','mental_health','general']
const ADMISSION_TYPES = ['outpatient','inpatient','emergency','day_case']

export const OpenCaseForm = ({ open, onClose, patients, physicians }: Props) => {
  const [form, setForm]   = useState(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useOpenCase()

  const set = (k: string, v: string) => {
    setError(null)
    setForm(p => ({ ...p, [k]: v }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patient_id || !form.department) {
      setError('Patient and department are required.')
      return
    }
    try {
      await mutateAsync({
        patient_id:     form.patient_id,
        physician_id:   form.physician_id  || undefined,
        department:     form.department,
        admission_type: form.admission_type || undefined,
        chief_complaint:form.chief_complaint || undefined,
      })
      setForm(INITIAL)
      onClose()
    } catch {
      setError('Failed to open case. Please try again.')
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
             onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white
                       shadow-2xl z-50 flex flex-col transition-transform duration-300
                       ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 py-5
                        border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Open Case File</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a new clinical case record
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-lg px-4 py-2.5">{error}</div>
          )}

          <Field label="Patient *">
            <select value={form.patient_id} onChange={e => set('patient_id', e.target.value)}
              className={selectCls}>
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} · {p.mrn}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Physician">
            <select value={form.physician_id} onChange={e => set('physician_id', e.target.value)}
              className={selectCls}>
              <option value="">Unassigned</option>
              {physicians.map(p => (
                <option key={p.id} value={p.id}>
                  Dr. {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department *">
              <select value={form.department} onChange={e => set('department', e.target.value)}
                className={selectCls}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d} className="capitalize">
                    {d.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Admission Type">
              <select value={form.admission_type}
                onChange={e => set('admission_type', e.target.value)}
                className={selectCls}>
                <option value="">Select</option>
                {ADMISSION_TYPES.map(t => (
                  <option key={t} value={t} className="capitalize">
                    {t.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Chief Complaint">
            <textarea value={form.chief_complaint}
              onChange={e => set('chief_complaint', e.target.value)}
              rows={3} placeholder="Primary reason for this visit…"
              className={`${selectCls} resize-none`} />
          </Field>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-300
                       text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={handleSubmit as any} disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                       disabled:opacity-60 text-white text-sm font-medium
                       flex items-center justify-center gap-2 transition">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? 'Opening…' : 'Open Case'}
          </button>
        </div>
      </div>
    </>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-700">{label}</label>
    {children}
  </div>
)

const selectCls = `w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                   text-slate-700 bg-white focus:outline-none focus:ring-2
                   focus:ring-sky-500 focus:border-transparent transition`