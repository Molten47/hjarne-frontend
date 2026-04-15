import { useState } from 'react'
import {
 Stethoscope, Clock, CheckCircle, XCircle,
  AlertTriangle, MessageSquare, Pill, Users,
} from 'lucide-react'
import { useUpdateCaseStatus } from '@/hooks/useCases'
import { usePatient }          from '@/hooks/usePatients'
import { useStaffMember }      from '@/hooks/useStaff'
import { DiagnosisForm }      from './DiagnosisForm'
import { CommunicationsTab }  from './CommunicationsTab'
import { PrescriptionsTab }   from './PrescriptionsTab'
import { TeamPanel } from './TeamPanel'
import type { CaseFile, Diagnosis } from '@/types'
import { useAuth } from '@/context/AuthContext'

interface Props {
  case_:      CaseFile
  diagnoses?: Diagnosis[]
}

const STATUS_STYLE: Record<string, string> = {
  open:       'bg-emerald-50 border-emerald-200 text-emerald-700',
  closed:     'bg-slate-50 border-slate-200 text-slate-600',
  discharged: 'bg-violet-50 border-violet-200 text-violet-700',
}

const SEVERITY_COLOR: Record<string, string> = {
  mild:     'bg-sky-50 text-sky-700',
  moderate: 'bg-amber-50 text-amber-700',
  severe:   'bg-orange-50 text-orange-700',
  critical: 'bg-red-50 text-red-700',
}

type Tab = 'overview' | 'communications' | 'prescriptions' | 'team'

export const CaseDetail = ({ case_: c, diagnoses = [] }: Props) => {
 const { user }                                 = useAuth()
  const isClinical                               = user?.roles.some(r => r === 'physician' || r === 'surgeon') ?? false
  const { mutateAsync: updateStatus, isPending } = useUpdateCaseStatus()
  const { data: patient }                        = usePatient(c.patient_id)
  const { data: physician }                      = useStaffMember(c.primary_physician_id ?? '')
  const [notes, setNotes] = useState('')
  const [tab, setTab]     = useState<Tab>('overview')

  const handleClose = async (status: 'closed' | 'discharged') => {
    await updateStatus({ id: c.id, status, notes: notes || undefined })
  }

  return (
    <div className="flex flex-col gap-5">

      {/* case header */}
      <div className={`rounded-xl border p-5 ${STATUS_STYLE[c.status]}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
          <p className="text-xs font-mono opacity-70 mb-1">{c.case_number}</p>
            {patient && (
              <p className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-2">
                <span>{patient.first_name} {patient.last_name}</span>
                <span className="font-mono opacity-60">{patient.mrn}</span>
                {patient.blood_group && (
                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-600
                                   border border-red-200 text-xs font-semibold">
                    {patient.blood_group}
                  </span>
                )}
              </p>
            )}
            <h3 className="font-semibold text-slate-900 text-base">
              {c.chief_complaint ?? 'No chief complaint recorded'}
            </h3>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
             {physician && (
                <span className="text-xs opacity-70">
                  Dr. {physician.first_name} {physician.last_name}
                </span>
              )}
              <span className="text-xs opacity-70 capitalize">{c.department}</span>
              <span className="text-xs opacity-70 capitalize">
                {c.admission_type?.replace('_', ' ') ?? 'outpatient'}
              </span>
              <span className="flex items-center gap-1 text-xs opacity-70">
                <Clock size={11} />
                Opened {new Date(c.opened_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full
                           border capitalize bg-white/60">
            {c.status}
          </span>
        </div>
      </div>

      {/* tab bar */}
      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {([
          { key: 'overview',       label: 'Overview',       icon: <Stethoscope size={13} />, clinical: false },
          { key: 'communications', label: 'Communications', icon: <MessageSquare size={13} />, clinical: true },
          { key: 'prescriptions',  label: 'Prescriptions',  icon: <Pill size={13} />, clinical: true },
          { key: 'team',           label: 'Team',           icon: <Users size={13} />, clinical: true },
        ] as { key: Tab; label: string; icon: React.ReactNode; clinical: boolean }[])
        .filter(t => !t.clinical || isClinical)
        .map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
                        border-b-2 transition -mb-px
                        ${tab === t.key
                          ? 'border-sky-600 text-sky-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* tab content */}
      {tab === 'overview' ? (
        <>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Stethoscope size={15} className="text-sky-500" />
                Diagnoses
              </h4>
              {c.status === 'open' && <DiagnosisForm caseId={c.id} />}
            </div>
            {diagnoses.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No diagnoses recorded yet
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {diagnoses.map(d => (
                  <div key={d.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-slate-600">
                          {d.icd10_code}
                        </span>
                        {d.severity && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                            capitalize ${SEVERITY_COLOR[d.severity]}`}>
                            {d.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-800 mt-0.5">{d.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(d.diagnosed_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {c.status === 'open' && (
            <div className="card p-5">
              <h4 className="flex items-center gap-2 text-sm font-semibold
                             text-slate-700 mb-4">
                <AlertTriangle size={15} className="text-amber-500" />
                Close Case
              </h4>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Closing notes (optional)…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5
                           text-sm text-slate-800 placeholder:text-slate-400 bg-white
                           focus:outline-none focus:ring-2 focus:ring-sky-500
                           focus:border-transparent transition resize-none mb-3"
              />
              <div className="flex gap-3">
                <button onClick={() => handleClose('discharged')} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5
                             rounded-lg bg-violet-600 hover:bg-violet-700
                             disabled:opacity-60 text-white text-sm font-medium transition">
                  <CheckCircle size={15} />
                  Discharge
                </button>
                <button onClick={() => handleClose('closed')} disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5
                             rounded-lg bg-slate-700 hover:bg-slate-800
                             disabled:opacity-60 text-white text-sm font-medium transition">
                  <XCircle size={15} />
                  Close Case
                </button>
              </div>
            </div>
          )}
        </>
      ) : tab === 'communications' ? (
        <CommunicationsTab caseId={c.id} />
      ) : tab === 'prescriptions' ? (
        <PrescriptionsTab caseId={c.id} isOpen={c.status === 'open'} />
      ) : (
        <TeamPanel caseId={c.id} isOpen={c.status === 'open'} />
      )}
    </div>
  )
}