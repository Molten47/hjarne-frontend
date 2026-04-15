import { useState} from 'react'
import { Plus, Trash2, Loader2, AlertTriangle, Pill } from 'lucide-react'
import { useCreatePrescription } from '@/hooks/usePrescriptions'
import { useDrugStock } from '@/hooks/usePrescriptions'

interface Props { caseId: string }

const ROUTES = ['oral', 'iv', 'im', 'subcutaneous', 'topical', 'inhaled', 'sublingual', 'rectal']

const EMPTY_ITEM = {
  drug_id: '',
  dosage: '',
  frequency: '',
  route: 'oral',
  duration_days: '',
  instructions: '',
}

const inputCls = `w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                  text-slate-800 bg-white placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-sky-500
                  focus:border-transparent transition`

export const PrescribeForm = ({ caseId }: Props) => {
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useCreatePrescription(caseId)
  const { data: stock = [] } = useDrugStock()

  const setItem = (index: number, key: string, value: string) => {
    setError(null)
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    ))
  }

  const addItem = () => setItems(prev => [...prev, { ...EMPTY_ITEM }])

  const removeItem = (index: number) =>
    setItems(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const item of items) {
      if (!item.drug_id || !item.dosage || !item.frequency || !item.route) {
        setError('All drug fields are required for each item.')
        return
      }
    }

    try {
      await mutateAsync({
        items: items.map(item => ({
          drug_id:      item.drug_id,
          dosage:       item.dosage,
          frequency:    item.frequency,
          route:        item.route,
          duration_days: item.duration_days ? parseInt(item.duration_days) : undefined,
          instructions: item.instructions || undefined,
        })),
      })
      setItems([{ ...EMPTY_ITEM }])
      setOpen(false)
    } catch {
      setError('Failed to create prescription.')
    }
  }

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center gap-2 text-xs font-medium text-violet-600
                 hover:text-violet-700 transition"
    >
      <Plus size={13} />
      New Prescription
    </button>
  )

  return (
    <form onSubmit={handleSubmit}
      className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4 bg-slate-50">

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200
                      rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertTriangle size={12} />
          {error}
        </p>
      )}

      {items.map((item, index) => (
        <div key={index}
          className="flex flex-col gap-3 p-3 rounded-lg bg-white border border-slate-200">

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Pill size={12} className="text-violet-500" />
              Drug {index + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {/* drug select */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Drug *</label>
            <select
              value={item.drug_id}
              onChange={e => setItem(index, 'drug_id', e.target.value)}
              className={inputCls}
            >
              <option value="">Select drug…</option>
              {stock.map(d => (
                <option key={d.drug_id} value={d.drug_id}>
                  {d.name} {d.is_low ? '⚠️ Low stock' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Dosage *</label>
              <input
                value={item.dosage}
                onChange={e => setItem(index, 'dosage', e.target.value)}
                placeholder="e.g. 500mg"
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Frequency *</label>
              <input
                value={item.frequency}
                onChange={e => setItem(index, 'frequency', e.target.value)}
                placeholder="e.g. Twice daily"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Route *</label>
              <select
                value={item.route}
                onChange={e => setItem(index, 'route', e.target.value)}
                className={inputCls}
              >
                {ROUTES.map(r => (
                  <option key={r} value={r} className="capitalize">{r}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Duration (days)</label>
              <input
                type="number"
                min="1"
                value={item.duration_days}
                onChange={e => setItem(index, 'duration_days', e.target.value)}
                placeholder="e.g. 7"
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">Instructions</label>
            <input
              value={item.instructions}
              onChange={e => setItem(index, 'instructions', e.target.value)}
              placeholder="e.g. Take with food"
              className={inputCls}
            />
          </div>
        </div>
      ))}

      {/* add another drug */}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-xs font-medium text-sky-600
                   hover:text-sky-700 transition self-start"
      >
        <Plus size={12} />
        Add another drug
      </button>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => { setOpen(false); setItems([{ ...EMPTY_ITEM }]) }}
          className="flex-1 py-2 rounded-lg border border-slate-300 text-xs
                     font-medium text-slate-600 hover:bg-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-700
                     disabled:opacity-60 text-white text-xs font-medium
                     flex items-center justify-center gap-1.5 transition"
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {isPending ? 'Prescribing…' : 'Submit Prescription'}
        </button>
      </div>
    </form>
  )
}