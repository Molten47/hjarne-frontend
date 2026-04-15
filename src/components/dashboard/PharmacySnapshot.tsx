import { AlertTriangle, CheckCircle } from 'lucide-react'
import type { Prescription } from '@/types'

interface Props {
  queue:   Prescription[]
  loading: boolean
}

// Static stock snapshot for now — will be wired to drug_stock API later
const STOCK_ITEMS = [
  { name: 'Tylenol',      level: 199, threshold: 50,  unit: 'mg' },
  { name: 'Amoxicillin',  level: 200, threshold: 50,  unit: 'mg' },
  { name: 'Hydrocodone',  level: 48,  threshold: 20,  unit: 'mg' },
  { name: 'Lisinopril',   level: 200, threshold: 50,  unit: 'mg' },
  { name: 'Lorazepam',    level: 19,  threshold: 20,  unit: 'mg' },
]

export const PharmacySnapshot = ({ queue, loading }: Props) => {
  const lowStock = STOCK_ITEMS.filter(i => i.level <= i.threshold)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Pharmacy
        </h3>
        {lowStock.length > 0 ? (
          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <AlertTriangle size={11} />
            {lowStock.length} low stock
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle size={11} />
            All stocked
          </span>
        )}
      </div>

      {/* queue summary */}
      <div className="flex items-center justify-between py-2.5
                      border-b border-slate-100 mb-3">
        <p className="text-xs text-slate-500">Pending prescriptions</p>
        {loading ? (
          <span className="text-xs text-slate-400">—</span>
        ) : (
          <span className="text-sm font-semibold text-slate-900">
            {queue.length}
          </span>
        )}
      </div>

      {/* stock levels */}
      <div className="flex flex-col gap-2">
        {STOCK_ITEMS.map(item => {
          const pct     = Math.min((item.level / 200) * 100, 100)
          const isLow   = item.level <= item.threshold
          const barColor = isLow ? 'bg-amber-400' : 'bg-emerald-400'

          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-slate-600">{item.name}</p>
                <p className={`text-xs font-medium ${isLow ? 'text-amber-600' : 'text-slate-500'}`}>
                  {item.level} {item.unit}
                  {isLow && ' ⚠'}
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}