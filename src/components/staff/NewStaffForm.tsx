import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCreateStaff } from '@/hooks/useStaff'

const ROLES = ['admin', 'physician', 'surgeon', 'nurse', 'pharmacist', 'desk']
const DEPARTMENTS = ['general', 'emergency', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'pharmacy', 'radiology', 'surgery']

const fieldCls = `w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                  text-slate-700 bg-white focus:outline-none focus:ring-2
                  focus:ring-sky-500 focus:border-transparent transition`

interface Props {
  onSuccess: () => void
}

export function NewStaffForm({ onSuccess }: Props) {
  const { mutate: create, isPending } = useCreateStaff()
  const [form, setForm] = useState({
    first_name: '', last_name: '', role: '',
    department: '', specialization: '', license_number: '',
  })
  const [error, setError] = useState<string | null>(null)

  const set = (k: string, v: string) => {
    setError(null)
    setForm(f => ({ ...f, [k]: v }))
  }

  const handleSubmit = () => {
    if (!form.first_name || !form.last_name || !form.role) {
      setError('First name, last name and role are required.')
      return
    }
    create(
      {
        first_name:     form.first_name,
        last_name:      form.last_name,
        role:           form.role,
        department:     form.department || undefined,
        specialization: form.specialization || undefined,
        license_number: form.license_number || undefined,
      },
      { onSuccess }
    )
  }

  return (
    <div className="flex flex-col gap-4">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600
                        text-xs rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700">First Name *</label>
          <input
            value={form.first_name}
            onChange={e => set('first_name', e.target.value)}
            placeholder="e.g. Anna"
            className={fieldCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-700">Last Name *</label>
          <input
            value={form.last_name}
            onChange={e => set('last_name', e.target.value)}
            placeholder="e.g. Lindqvist"
            className={fieldCls}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700">Role *</label>
        <select value={form.role} onChange={e => set('role', e.target.value)}
          className={fieldCls}>
          <option value="">Select role…</option>
          {ROLES.map(r => (
            <option key={r} value={r} className="capitalize">{r}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700">Department</label>
        <select value={form.department} onChange={e => set('department', e.target.value)}
          className={fieldCls}>
          <option value="">None</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d} className="capitalize">{d}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700">
          Specialization <span className="text-slate-400">(optional)</span>
        </label>
        <input
          value={form.specialization}
          onChange={e => set('specialization', e.target.value)}
          placeholder="e.g. Cardiothoracic"
          className={fieldCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-slate-700">
          License Number <span className="text-slate-400">(optional)</span>
        </label>
        <input
          value={form.license_number}
          onChange={e => set('license_number', e.target.value)}
          placeholder="e.g. SE-12345"
          className={fieldCls}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                     disabled:opacity-60 text-white text-sm font-medium
                     flex items-center justify-center gap-2 transition"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Creating…' : 'Create Staff Member'}
        </button>
      </div>

    </div>
  )
}