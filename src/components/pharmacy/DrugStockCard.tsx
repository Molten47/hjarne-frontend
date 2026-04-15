import type { DrugStock } from '@/types'
import { Package, TrendingDown } from 'lucide-react'

interface Props {
  drug: DrugStock
}

export function DrugStockRow({ drug }: Props) {
  const pct       = Math.min(100, Math.round((drug.quantity_on_hand / Math.max(drug.reorder_threshold * 2, 1)) * 100))
  const isVeryLow = drug.quantity_on_hand <= Math.floor(drug.reorder_threshold / 2)

  const barColor = isVeryLow
    ? 'bg-red-500'
    : drug.is_low
      ? 'bg-amber-400'
      : pct > 60 ? 'bg-sky-500' : 'bg-sky-400'

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors
                     ${drug.is_low
                       ? 'bg-red-50 border-red-200'
                       : 'bg-white border-slate-100 hover:border-sky-200 hover:bg-sky-50/40'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                       ${drug.is_low ? 'bg-red-100 text-red-500' : 'bg-sky-100 text-sky-600'}`}>
        {drug.is_low
          ? <TrendingDown className="w-4 h-4" />
          : <Package className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0">
        {/* top row: name + fraction */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{drug.name}</p>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-sm font-bold tabular-nums
                              ${isVeryLow ? 'text-red-600' : drug.is_low ? 'text-amber-600' : 'text-slate-800'}`}>
              {drug.quantity_on_hand}
              <span className="text-slate-400 font-normal mx-0.5">/</span>
              <span className="text-slate-500 font-medium">{drug.reorder_threshold}</span>
              {drug.unit && (
                <span className="text-xs font-normal text-slate-400 ml-1">{drug.unit}</span>
              )}
            </span>
            {isVeryLow && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                Critical
              </span>
            )}
            {!isVeryLow && drug.is_low && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full
                               bg-amber-100 text-amber-700 border border-amber-200">
                Low
              </span>
            )}
          </div>
        </div>

        {/* bottom row: category + bar + reorder label */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400 w-24 shrink-0 truncate">{drug.category ?? '—'}</p>
          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 w-16 text-right shrink-0">
            reorder ≤{drug.reorder_threshold}
          </p>
        </div>
      </div>
    </div>
  )
}