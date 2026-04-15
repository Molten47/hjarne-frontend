import { Pill } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { prescriptionsApi } from '@/api/prescriptions'
import { PrescribeForm } from './PrescribeForm'
import type { Prescription } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Brain, Clock, ShieldAlert, AlertTriangle } from 'lucide-react'

interface Props {
  caseId: string
  isOpen: boolean
}

const STATUS_STYLE: Record<string, string> = {
  approved:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  dispensed: 'bg-slate-50 text-slate-600 border-slate-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
}

export const PrescriptionsTab = ({ caseId, isOpen }: Props) => {
  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['prescriptions', 'case', caseId],
    queryFn: async () => {
      const res = await prescriptionsApi.queue()
      return res.filter((p: Prescription) => p.case_file_id === caseId)
    },
    enabled: !!caseId,
  })

  return (
    <div className="flex flex-col gap-5">

      {/* header */}
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Pill size={15} className="text-violet-500" />
          Prescriptions
        </h4>
        {isOpen && <PrescribeForm caseId={caseId} />}
      </div>

      {/* list */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-slate-400 text-center py-10">Loading…</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">
            No prescriptions on this case yet
          </p>
        ) : (
          prescriptions.map((rx: Prescription) => {
            const hasFlagged = rx.items.some(i => i.contraindication_flagged)
            return (
              <div key={rx.id}
                className={`card p-4 flex flex-col gap-3
                  ${hasFlagged ? 'border-red-200' : ''}`}>

                {/* rx header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      RX-{rx.id.slice(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatDistanceToNow(new Date(rx.prescribed_at), { addSuffix: true })}
                      </span>
                      {rx.ai_confidence != null && (
                        <span className="flex items-center gap-1">
                          <Brain size={11} />
                          AI {Math.round(rx.ai_confidence * 100)}% confident
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize
                    ${STATUS_STYLE[rx.status]}`}>
                    {rx.status}
                  </span>
                </div>

                {/* contraindication warning */}
                {hasFlagged && (
                  <div className="flex items-center gap-2 text-xs text-red-600
                                  bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} />
                    Contraindication flagged on one or more items
                  </div>
                )}

                {/* items */}
                <div className="flex flex-col gap-2">
                  {rx.items.map(item => (
                    <div key={item.id}
                      className={`rounded-lg px-3 py-2 text-xs flex flex-col gap-0.5
                        ${item.contraindication_flagged
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-slate-50 border border-slate-100'}`}>
                      <div className="flex items-center gap-1.5">
                        {item.contraindication_flagged
                          ? <ShieldAlert size={11} className="text-red-500 shrink-0" />
                          : <Pill size={11} className="text-slate-400 shrink-0" />
                        }
                        <span className="font-semibold text-slate-800">{item.drug_name}</span>
                        {item.generic_name && (
                          <span className="text-slate-400">({item.generic_name})</span>
                        )}
                        {item.is_controlled && (
                          <span className="ml-auto text-amber-600 font-medium">Controlled</span>
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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}