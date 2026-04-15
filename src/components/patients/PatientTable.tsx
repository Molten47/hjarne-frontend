import { useNavigate } from 'react-router-dom'
import type { Patient } from '@/types'

interface Props {
  patients: Patient[]
  loading:  boolean
}

const BLOOD_COLOR: Record<string, string> = {
  'O+': 'bg-red-50 text-red-600',
  'O-': 'bg-red-100 text-red-700',
  'A+': 'bg-sky-50 text-sky-600',
  'A-': 'bg-sky-100 text-sky-700',
  'B+': 'bg-violet-50 text-violet-600',
  'B-': 'bg-violet-100 text-violet-700',
  'AB+':'bg-emerald-50 text-emerald-600',
  'AB-':'bg-emerald-100 text-emerald-700',
}

export const PatientTable = ({ patients, loading }: Props) => {
  const navigate = useNavigate()

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-7 h-7 rounded-full border-2 border-sky-500
                      border-t-transparent animate-spin" />
    </div>
  )

  if (patients.length === 0) return (
    <div className="text-center py-20">
      <p className="text-slate-400 text-sm">No patients found</p>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {['Patient', 'MRN', 'Date of Birth', 'Gender', 'Blood Type', ''].map(h => (
              <th key={h}
                className="text-left text-xs font-semibold text-slate-500
                           uppercase tracking-wider pb-3 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map(p => (
            <tr key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="hover:bg-slate-50 cursor-pointer transition-colors group">

              {/* avatar + name */}
              <td className="py-4 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700
                                  flex items-center justify-center text-xs
                                  font-semibold shrink-0">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {p.first_name} {p.last_name}
                    </p>
                  </div>
                </div>
              </td>

              <td className="py-4 pr-4 font-mono text-xs text-slate-500">
                {p.mrn}
              </td>

              <td className="py-4 pr-4 text-slate-600">
                {p.date_of_birth ?? '—'}
              </td>

              <td className="py-4 pr-4 text-slate-600 capitalize">
                {p.gender}
              </td>

              <td className="py-4 pr-4">
                {p.blood_group ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                    ${BLOOD_COLOR[p.blood_group] ?? 'bg-slate-100 text-slate-600'}`}>
                    {p.blood_group}
                  </span>
                ) : '—'}
              </td>

              <td className="py-4 text-right">
                <span className="text-xs text-sky-600 font-medium opacity-0
                                 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}