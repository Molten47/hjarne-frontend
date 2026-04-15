import { useNavigate } from 'react-router-dom'
import type { Patient } from '@/types'

interface Props {
  patients: Patient[]
  loading:  boolean
  compact?: boolean
}

export const RecentPatients = ({ patients, loading, compact }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Recent Patients
      </h3>

      {loading ? <Spinner /> : patients.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No patients found</p>
      ) : compact ? (
        // compact card list for mobile and smaller panels
        <div className="flex flex-col gap-2">
          {patients.map(p => (
            <button key={p.id} onClick={() => navigate('/patients')}
              className="flex items-center gap-3 p-3 rounded-lg
                         hover:bg-slate-50 transition-colors text-left w-full">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700
                              flex items-center justify-center text-xs font-semibold shrink-0">
                {p.first_name[0]}{p.last_name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-xs text-slate-500">{p.mrn}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // full table for desktop
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Name', 'MRN', 'DOB', 'Blood Type'].map(h => (
                  <th key={h} className="text-left text-slate-500 font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.slice(0, 8).map(p => (
                <tr key={p.id} onClick={() => navigate('/patients')}
                  className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="py-3 pr-4 text-slate-500 font-mono text-xs">{p.mrn}</td>
                  <td className="py-3 pr-4 text-slate-500">{p.date_of_birth ?? '—'}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium
                                     bg-sky-50 text-sky-700">
                      {p.blood_group ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-6 h-6 rounded-full border-2 border-sky-500
                    border-t-transparent animate-spin" />
  </div>
)