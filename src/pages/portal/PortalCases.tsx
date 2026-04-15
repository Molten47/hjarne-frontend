import { useState }   from 'react'
import { useQuery }   from '@tanstack/react-query'
import { portalApi }  from '@/api/portal'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  open:       'bg-emerald-100 text-emerald-700',
  closed:     'bg-slate-100 text-slate-600',
  discharged: 'bg-sky-100 text-sky-700',
}

const DiagnosisPanel = ({ caseId }: { caseId: string }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['portal-diagnoses', caseId],
    queryFn:  () => portalApi.diagnoses(caseId),
  })

  if (isLoading) return (
    <div className="pt-3 text-sm text-slate-400">Loading diagnoses…</div>
  )
  if (data.length === 0) return (
    <div className="pt-3 text-sm text-slate-400">No diagnoses recorded yet.</div>
  )

  return (
    <div className="pt-3 space-y-2">
      {data.map(d => (
        <div key={d.id} className="bg-slate-50 rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-sky-100 text-sky-700
                             px-1.5 py-0.5 rounded">{d.icd10_code}</span>
            {d.severity && (
              <span className="text-xs text-slate-400 capitalize">{d.severity}</span>
            )}
          </div>
          <p className="text-sm text-slate-700 mt-1">{d.description}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(d.diagnosed_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export const PortalCases = () => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(null)

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['portal-cases'],
    queryFn:  portalApi.cases,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/portal/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-semibold text-slate-800">My Cases & Results</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-sky-500
                            border-t-transparent animate-spin" />
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No cases found
          </div>
        ) : cases.map(c => (
          <div key={c.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              className="w-full text-left p-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">
                    {c.case_number}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                    capitalize ${STATUS_COLOR[c.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {c.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{c.department}</p>
                {c.chief_complaint && (
                  <p className="text-sm text-slate-500 mt-0.5">{c.chief_complaint}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Opened {new Date(c.opened_at).toLocaleDateString()}
                </p>
              </div>
              {expanded === c.id
                ? <ChevronUp size={16} className="text-slate-400 shrink-0 mt-1" />
                : <ChevronDown size={16} className="text-slate-400 shrink-0 mt-1" />
              }
            </button>

            {expanded === c.id && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase
                               tracking-wide mt-3 mb-1">Diagnoses</p>
                <DiagnosisPanel caseId={c.id} />
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}