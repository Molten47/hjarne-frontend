import { useState }     from 'react'
import { X, Loader2, CheckCircle, Copy, Check }   from 'lucide-react'
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
  const [form, setForm]       = useState(INITIAL)
  const [error, setError]     = useState<string | null>(null)
  const [created, setCreated] = useState<{ mrn: string; name: string } | null>(null)
  const [copied, setCopied]   = useState(false)
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
      const patient = await mutateAsync({
        ...form,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : undefined,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : undefined,
      })
      setCreated({ mrn: patient.mrn, name: `${patient.first_name} ${patient.last_name}` })
      setForm(INITIAL)
    } catch {
      setError('Failed to register patient. Please try again.')
    }
  }

  const handleClose = () => {
    setCreated(null)
    setCopied(false)
    onClose()
  }

  const copyCredentials = () => {
    if (!created) return
    navigator.clipboard.writeText(`MRN: ${created.mrn}\nPassword: patient123`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={e => e.target === e.currentTarget && handleClose()}>

      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg
                      max-h-[90vh] overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {created ? 'Patient Registered' : 'Register Patient'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {created
                ? 'Record created and portal access granted'
                : 'New patient record — all starred fields required'}
            </p>
          </div>
          <button onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* ── Success state ── */}
        {created ? (
          <div className="px-6 py-8 flex flex-col items-center gap-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>

            <div>
              <p className="font-semibold text-slate-900 text-base">{created.name}</p>
              <p className="text-sm text-slate-500 mt-0.5">has been added to the system</p>
            </div>

            {/* portal credentials card */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Portal Access Credentials
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">MRN (username)</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {created.mrn}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Temporary password</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    patient123
                  </span>
                </div>
              </div>

              <button
                onClick={copyCredentials}
                className="mt-4 w-full flex items-center justify-center gap-2
                           py-2 rounded-lg border border-slate-300 text-xs
                           font-medium text-slate-600 hover:bg-white transition">
                {copied
                  ? <><Check size={13} className="text-emerald-500" /> Copied</>
                  : <><Copy size={13} /> Copy credentials</>}
              </button>

              <p className="text-xs text-slate-400 mt-3 text-center">
                In production, these would be sent to the patient via email invite.
              </p>
            </div>

            <button onClick={handleClose}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                         text-white text-sm font-medium transition">
              Done
            </button>
          </div>

        ) : (

        /* ── Form state ── */
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name *" value={form.first_name}
              onChange={v => set('first_name', v)} placeholder="e.g. Sophia" />
            <Field label="Last Name *" value={form.last_name}
              onChange={v => set('last_name', v)} placeholder="e.g. Tremblay" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth *" value={form.date_of_birth}
              onChange={v => set('date_of_birth', v)} type="date" />
            <SelectField label="Gender *" value={form.gender}
              onChange={v => set('gender', v)}
              options={['', 'male', 'female', 'other']}
              labels={['Select gender', 'Male', 'Female', 'Other']} />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Height (cm)" value={form.height_cm}
              onChange={v => set('height_cm', v)}
              type="number" placeholder="e.g. 172" />
            <Field label="Weight (kg)" value={form.weight_kg}
              onChange={v => set('weight_kg', v)}
              type="number" placeholder="e.g. 70" />
          </div>

          <Field label="Nationality" value={form.nationality}
            onChange={v => set('nationality', v)} placeholder="e.g. Canadian" />

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={handleClose}
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
        )}
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