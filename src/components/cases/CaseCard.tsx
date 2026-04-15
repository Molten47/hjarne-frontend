import { FolderOpen, Calendar, Building2 } from 'lucide-react'
import { usePatient } from '@/hooks/usePatients'
import type { CaseFile } from '@/types'

interface Props {
  case_:    CaseFile
  onClick:  () => void
  selected: boolean
}

const STATUS_STYLE: Record<string, string> = {
  open:       'bg-emerald-100 text-emerald-700',
  closed:     'bg-slate-100 text-slate-600',
  discharged: 'bg-violet-100 text-violet-700',
}

const ADMISSION_COLOR: Record<string, string> = {
  inpatient:  'border-l-sky-500',
  outpatient: 'border-l-emerald-500',
  emergency:  'border-l-red-500',
  day_case:   'border-l-amber-500',
}

export const CaseCard = ({ case_: c, onClick, selected }: Props) => {
  const { data: patient } = usePatient(c.patient_id)

  return (
    <div onClick={onClick}
      className={`card p-4 cursor-pointer border-l-4 transition-all
                  hover:shadow-sm active:scale-[0.99]
                  ${ADMISSION_COLOR[c.admission_type ?? ''] ?? 'border-l-slate-300'}
                  ${selected ? 'ring-2 ring-sky-500' : ''}`}>

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FolderOpen size={14} className="text-slate-400 shrink-0" />
          <p className="text-xs font-mono text-slate-500">{c.case_number}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
                          ${STATUS_STYLE[c.status] ?? 'bg-slate-100 text-slate-600'}`}>
          {c.status}
        </span>
      </div>

      {/* patient identity */}
      {patient ? (
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center
                          justify-center text-xs font-semibold shrink-0">
            {patient.first_name[0]}{patient.last_name[0]}
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {patient.first_name} {patient.last_name}
          </p>
          <span className="text-xs font-mono text-slate-400">{patient.mrn}</span>
        </div>
      ) : (
        <div className="h-5 w-32 bg-slate-100 rounded animate-pulse mb-1.5" />
      )}

      {c.chief_complaint && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-1">
          {c.chief_complaint}
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-slate-500 capitalize">
          <Building2 size={11} />
          {c.department}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar size={11} />
          {new Date(c.opened_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
        {c.admission_type && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize
                            ${c.admission_type === 'emergency'
                              ? 'bg-red-50 text-red-600'
                              : c.admission_type === 'inpatient'
                              ? 'bg-sky-50 text-sky-600'
                              : 'bg-slate-100 text-slate-500'
                            }`}>
            {c.admission_type.replace('_', ' ')}
          </span>
        )}
      </div>
    </div>
  )
}