import { formatDistanceToNow } from 'date-fns'
import {
  Clock, Brain, CheckCircle2, AlertTriangle,
  ShieldAlert, Pill,
} from 'lucide-react'
import type { Prescription } from '@/types'

interface Props {
  prescription: Prescription
  onDispense:   (id: string) => void
  isDispensing: boolean
}

export function PrescriptionCard({ prescription: rx, onDispense, isDispensing }: Props) {
  const waitTime   = formatDistanceToNow(new Date(rx.prescribed_at), { addSuffix: false })
  const hasFlagged = rx.items.some(i => i.contraindication_flagged)
  const hasCtrl    = rx.items.some(i => i.is_controlled)

  return (
    <div className={`rounded-2xl border bg-white shadow-sm flex flex-col
                     overflow-hidden transition-shadow hover:shadow-md
                     ${hasFlagged ? 'border-red-200' : 'border-slate-200'}`}>

      <div className={`h-1 w-full ${hasFlagged ? 'bg-red-400' : 'bg-sky-500'}`} />

      <div className="p-4 flex flex-col gap-3">
        {/* header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-slate-800 font-mono tracking-wide">
              RX-{rx.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Case: {rx.case_file_id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                             bg-sky-50 text-sky-700 border border-sky-200">
              MD Approved
            </span>
            {hasCtrl && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full
                               bg-amber-50 text-amber-700 border border-amber-200">
                Controlled
              </span>
            )}
          </div>
        </div>

        {/* meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{waitTime}
          </span>
          {rx.ai_confidence != null && (
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              AI {Math.round(rx.ai_confidence * 100)}%
            </span>
          )}
        </div>

        {/* contraindication banner */}
        {hasFlagged && (
          <div className="flex items-center gap-2 text-xs text-red-600
                          bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Contraindication flagged — verify before dispensing
          </div>
        )}

        {/* drug items */}
        <div className="flex flex-col gap-2">
          {rx.items.map(item => (
            <div key={item.id}
              className={`rounded-xl px-3 py-2.5 text-xs flex flex-col gap-0.5
                ${item.contraindication_flagged
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-slate-50 border border-slate-100'}`}>
              <div className="flex items-center gap-1.5">
                {item.contraindication_flagged
                  ? <ShieldAlert className="w-3 h-3 text-red-500 shrink-0" />
                  : <Pill className="w-3 h-3 text-sky-400 shrink-0" />}
                <span className="font-semibold text-slate-800">{item.drug_name}</span>
                {item.generic_name && (
                  <span className="text-slate-400">({item.generic_name})</span>
                )}
                {item.is_controlled && (
                  <span className="ml-auto text-amber-600 font-semibold">Controlled</span>
                )}
              </div>
              <p className="text-slate-500 pl-4">
                {item.dosage} · {item.frequency} · {item.route}
                {item.duration_days ? ` · ${item.duration_days}d` : ''}
              </p>
              {item.instructions && (
                <p className="text-slate-400 pl-4 italic">{item.instructions}</p>
              )}
            </div>
          ))}
        </div>

        {/* dispense */}
        <button
          disabled={isDispensing}
          onClick={() => onDispense(rx.id)}
          className={`w-full mt-1 flex items-center justify-center gap-2 py-2.5
                      rounded-xl text-sm font-semibold transition disabled:opacity-60
                      ${hasFlagged
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'}`}>
          <CheckCircle2 className="w-4 h-4" />
          {isDispensing ? 'Dispensing…' : hasFlagged ? 'Dispense Anyway' : 'Dispense'}
        </button>
      </div>
    </div>
  )
}