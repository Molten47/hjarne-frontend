import { useState } from 'react'
import { Loader2, AlertTriangle, X } from 'lucide-react'
import { useGrantAccess } from '@/hooks/useStaff'
import type { Staff } from '@/types'

const fieldCls = `w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                  text-slate-700 bg-white focus:outline-none focus:ring-2
                  focus:ring-sky-500 focus:border-transparent transition`

interface Props {
  staff: Staff
  onClose: () => void
}

export function GrantAccessModal({ staff, onClose }: Props) {
  const { mutateAsync, isPending } = useGrantAccess()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    if (!email.trim() || password.length < 8) {
      setError('Valid email and a password of at least 8 characters are required.')
      return
    }
    try {
      await mutateAsync({ staffId: staff.id, email: email.trim(), password })
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Failed to grant access.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >

        {/* header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Grant Portal Access
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {staff.first_name} {staff.last_name} · {staff.staff_code}
            </p>
          </div>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1">
            <X size={16} />
          </button>
        </div>

        {/* warning */}
        <div className="flex items-start gap-2 text-xs text-amber-700
                        bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
          Staff will be required to change this password on first login.
        </div>

        {/* error */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200
                        rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* fields */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => { setError(null); setEmail(e.target.value) }}
              placeholder="staff@hjarne.se"
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-700">Temporary Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => { setError(null); setPassword(e.target.value) }}
              placeholder="Min. 8 characters"
              className={fieldCls}
            />
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-300
                       text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700
                       disabled:opacity-60 text-white text-sm font-medium
                       flex items-center justify-center gap-2 transition"
          >
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? 'Granting…' : 'Grant Access'}
          </button>
        </div>

      </div>
    </div>
  )
}