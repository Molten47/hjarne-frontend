import { useState }     from 'react'
import { X, Loader2 }   from 'lucide-react'
import { useCreatePatient } from '@/hooks/usePatients'

interface Props {
  open:    boolean
  onClose: () => void
}

const INITIAL = {
  first_name: '', last_name: '',  date_of_birth: '',
  gender: '',     blood_group: '', genotype: '',
  height_cm: '',  weight_kg: '',   nationality: '',
}

export const NewPatientForm = ({ open, onClose }: Props) => {
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useCreatePatient()

  if (!open) return null

  const set = (k: string, v: string) => {
    setError(null)
    setForm(p => ({ ...p, [k]: v }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.date_of_birth || !form.gender) {
      setError('Please fill in all required fields.')
      return
    }
    try {
      await mutateAsync({
        ...form,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : undefined,
      })
      setForm(INITIAL)
      onClose()
    } catch {
      setError('Failed to register patient. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={e => e.target === e.currentTarget && onClose()}>

      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg
                      max-h-[90vh] overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Register Patient</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              New patient record — all starred fields required
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* name row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name *" value={form.first_name}
              onChange={v => set('first_name', v)} placeholder="e.g. Sophia" />
            <Field label="Last Name *" value={form.last_name}
              onChange={v => set('last_name', v)} placeholder="e.g. Tremblay" />
          </div>

          {/* dob + gender */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth *" value={form.date_of_birth}
              onChange={v => set('date_of_birth', v)} type="date" />
            <SelectField label="Gender *" value={form.gender}
              onChange={v => set('gender', v)}
              options={['', 'male', 'female', 'other']}
              labels={['Select gender', 'Male', 'Female', 'Other']} />
          </div>

          {/* blood + genotype */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Blood Group" value={form.blood_group}
              onChange={v => set('blood_group', v)}
              options={['', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']}
              labels={['Unknown', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']} />
            <SelectField label="Genotype" value={form.genotype}
              onChange={v => set('genotype', v)}
              options={['', 'AA', 'AS', 'SS', 'AC', 'SC']}
              labels={['Unknown', 'AA', 'AS', 'SS', 'AC', 'SC']} />
          </div>

          {/* height + weight */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (cm)" value={form.height_cm}
              onChange={v => set('height_cm', v)}
              type="number" placeholder="e.g. 172" />
            <Field label="Weight (kg)" value={form.weight_kg}
              onChange={v => set('weight_kg', v)}
              type="number" placeholder="e.g. 70" />
          </div>

          {/* nationality */}
          <Field label="Nationality" value={form.nationality}
            onChange={v => set('nationality', v)} placeholder="e.g. Canadian" />

          {/* actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-300
                         text-sm font-medium text-slate-600
                         hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                         disabled:opacity-60 text-white text-sm font-medium
                         flex items-center justify-center gap-2 transition">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? 'Registering…' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── field primitives ─────────────────────────────────────
const Field = ({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-700">{label}</label>
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                 text-slate-900 placeholder:text-slate-400 bg-white
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                 focus:border-transparent transition" />
  </div>
)

const SelectField = ({ label, value, onChange, options, labels }: {
  label: string; value: string; onChange: (v: string) => void
  options: string[]; labels: string[]
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-700">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                 text-slate-700 bg-white appearance-none cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-sky-500
                 focus:border-transparent transition">
      {options.map((o, i) => (
        <option key={o} value={o}>{labels[i]}</option>
      ))}
    </select>
  </div>
)