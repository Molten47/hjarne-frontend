import { useState }       from 'react'
import { X, Loader2 }     from 'lucide-react'
import { useCreateAppointment } from '@/hooks/useAppointments'
import type { Patient, Staff } from '@/types'

interface Props {
  open:       boolean
  onClose:    () => void
  patients:   Patient[]
  physicians: Staff[]
}

const INITIAL = {
  patient_id: '', physician_id: '', department: '',
  appointment_type: '', scheduled_at: '', duration_minutes: '30',
  reason: '', channel: 'in_person',
}

const TYPES = [
  'consultation','follow_up','procedure',
  'surgery','prenatal','postnatal','mental_health','emergency',
]

const DEPARTMENTS = [
  'consultation','maternity','surgery','mental_health','general',
]

export const BookAppointmentSheet = ({ open, onClose, patients, physicians }: Props) => {
  const [form, setForm]   = useState(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useCreateAppointment()

  const set = (k: string, v: string) => {
    setError(null)
    setForm(p => ({ ...p, [k]: v }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patient_id || !form.department ||
        !form.appointment_type || !form.scheduled_at) {
      setError('Please fill in all required fields.')
      return
    }
    try {
      await mutateAsync({
        patient_id:       form.patient_id,
        physician_id:     form.physician_id || undefined,
        department:       form.department,
        appointment_type: form.appointment_type,
        scheduled_at:     new Date(form.scheduled_at).toISOString(),
        duration_minutes: parseInt(form.duration_minutes),
        reason:           form.reason || undefined,
        channel:          form.channel,
      })
      setForm(INITIAL)
      onClose()
    } catch {
      setError('Failed to book appointment. Please try again.')
    }
  }

  return (
    <>
      {/* backdrop */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
             onClick={onClose} />
      )}

      {/* sheet */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white
                       shadow-2xl z-50 flex flex-col transition-transform duration-300
                       ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Book Appointment</h2>
            <p className="text-xs text-slate-500 mt-0.5">Schedule a new patient appointment</p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* patient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Patient *</label>
            <select value={form.patient_id} onChange={e => set('patient_id', e.target.value)}
              className={selectCls}>
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name} · {p.mrn}
                </option>
              ))}
            </select>
          </div>

          {/* physician */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Physician</label>
            <select value={form.physician_id} onChange={e => set('physician_id', e.target.value)}
              className={selectCls}>
              <option value="">Unassigned</option>
              {physicians.map(p => (
                <option key={p.id} value={p.id}>
                  Dr. {p.first_name} {p.last_name} · {p.department}
                </option>
              ))}
            </select>
          </div>

          {/* department + type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Department *</label>
              <select value={form.department} onChange={e => set('department', e.target.value)}
                className={selectCls}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d} className="capitalize">{d.replace('_',' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Type *</label>
              <select value={form.appointment_type} onChange={e => set('appointment_type', e.target.value)}
                className={selectCls}>
                <option value="">Select</option>
                {TYPES.map(t => (
                  <option key={t} value={t} className="capitalize">{t.replace('_',' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* date/time + duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Date & Time *</label>
              <input type="datetime-local" value={form.scheduled_at}
                onChange={e => set('scheduled_at', e.target.value)}
                className={selectCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Duration (min)</label>
              <select value={form.duration_minutes}
                onChange={e => set('duration_minutes', e.target.value)}
                className={selectCls}>
                {[15,30,45,60,90,120].map(d => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
          </div>

          {/* channel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Channel</label>
            <div className="flex gap-2">
              {['in_person','telehealth','phone'].map(c => (
                <button key={c} type="button"
                  onClick={() => set('channel', c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium
                              border transition capitalize
                              ${form.channel === c
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white text-slate-600 border-slate-300 hover:border-sky-400'
                              }`}>
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Reason</label>
            <textarea value={form.reason} onChange={e => set('reason', e.target.value)}
              rows={3} placeholder="Brief reason for the appointment…"
              className={`${selectCls} resize-none`} />
          </div>
        </form>

        {/* footer */}
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
            {isPending ? 'Booking…' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </>
  )
}

const selectCls = `w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                   text-slate-700 bg-white focus:outline-none focus:ring-2
                   focus:ring-sky-500 focus:border-transparent transition`