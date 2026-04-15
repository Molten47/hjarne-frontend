import { useState }    from 'react'
import { Loader2, Plus } from 'lucide-react'
import { useAddDiagnosis } from '@/hooks/useCases'

interface Props { caseId: string }

const SEVERITY = ['mild', 'moderate', 'severe', 'critical']

const INITIAL = { icd10_code: '', description: '', severity: '', notes: '' }

export const DiagnosisForm = ({ caseId }: Props) => {
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useAddDiagnosis(caseId)

  const set = (k: string, v: string) => {
    setError(null)
    setForm(p => ({ ...p, [k]: v }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.icd10_code || !form.description) {
      setError('ICD-10 code and description are required.')
      return
    }
    try {
      await mutateAsync({
        icd10_code:  form.icd10_code,
        description: form.description,
        severity:    form.severity || undefined,
        notes:       form.notes   || undefined,
      })
      setForm(INITIAL)
      setOpen(false)
    } catch {
      setError('Failed to add diagnosis.')
    }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-2 text-xs font-medium text-sky-600
                 hover:text-sky-700 transition">
      <Plus size={13} />
      Add Diagnosis
    </button>
  )

  return (
    <form onSubmit={handleSubmit}
      className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-slate-50">

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200
                      rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">ICD-10 Code *</label>
          <input value={form.icd10_code} onChange={e => set('icd10_code', e.target.value)}
            placeholder="e.g. J06.9" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-600">Severity</label>
          <select value={form.severity} onChange={e => set('severity', e.target.value)}
            className={inputCls}>
            <option value="">Select</option>
            {SEVERITY.map(s => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Description *</label>
        <input value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="e.g. Acute upper respiratory infection"
          className={inputCls} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-600">Notes</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
          rows={2} placeholder="Additional clinical notes…"
          className={`${inputCls} resize-none`} />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={() => { setOpen(false); setForm(INITIAL) }}
          className="flex-1 py-2 rounded-lg border border-slate-300 text-xs
                     font-medium text-slate-600 hover:bg-white transition">
          Cancel
        </button>
        <button type="submit" disabled={isPending}
          className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-700
                     disabled:opacity-60 text-white text-xs font-medium
                     flex items-center justify-center gap-1.5 transition">
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {isPending ? 'Saving…' : 'Add Diagnosis'}
        </button>
      </div>
    </form>
  )
}

const inputCls = `w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                  text-slate-800 bg-white placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-transparent transition`