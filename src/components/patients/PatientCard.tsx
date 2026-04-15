import { useNavigate } from 'react-router-dom'
import type { Patient } from '@/types'

interface Props { patient: Patient }

export const PatientCard = ({ patient: p }: Props) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/patients/${p.id}`)}
      className="card p-4 flex items-center gap-4 cursor-pointer
                 hover:shadow-sm active:scale-[0.99] transition-all">

      {/* avatar */}
      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700
                      flex items-center justify-center text-sm
                      font-semibold shrink-0">
        {p.first_name[0]}{p.last_name[0]}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">
          {p.first_name} {p.last_name}
        </p>
        <p className="text-xs text-slate-500 font-mono mt-0.5">{p.mrn}</p>
      </div>

      {/* blood group */}
      {p.blood_group && (
        <span className="text-xs font-semibold text-sky-600 bg-sky-50
                         px-2.5 py-1 rounded-full shrink-0">
          {p.blood_group}
        </span>
      )}
    </div>
  )
}