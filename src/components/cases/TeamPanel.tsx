import { useState } from 'react'
import { Users, UserPlus, Loader2 } from 'lucide-react'
import { useAssignments, useAssignStaff } from '@/hooks/useCases'
import { useStaff } from '@/hooks/useStaff'
import { useAuth } from '@/hooks/useAuth'
import type { Staff } from '@/types'

interface Props {
  caseId:  string
  isOpen:  boolean
}

const ROLE_STYLE: Record<string, string> = {
  physician: 'bg-sky-50 text-sky-700 border-sky-200',
  surgeon:   'bg-violet-50 text-violet-700 border-violet-200',
}

export const TeamPanel = ({ caseId, isOpen }: Props) => {
  const { user }                              = useAuth()
  const { data: assignments = [], isLoading } = useAssignments(caseId)
  const { data: allStaff    = [] }            = useStaff()
  const { mutateAsync: assign, isPending }    = useAssignStaff(caseId)
  const [adding, setAdding]                   = useState(false)
  const [selected, setSelected]               = useState('')
  const [err, setErr]                         = useState('')

  const canAssign =
    user?.roles.includes('admin') ||
    user?.roles.includes('physician') ||
    user?.roles.includes('surgeon')

  // physicians and surgeons only, not already on the case
  const assignedIds = new Set(assignments.map(a => a.staff_id))
  const eligible: Staff[] = allStaff.filter(
    s => (s.role === 'physician' || s.role === 'surgeon') &&
         s.is_active &&
         !assignedIds.has(s.id)
  )

  const handleAssign = async () => {
    if (!selected) return
    setErr('')
    try {
      await assign(selected)
      setSelected('')
      setAdding(false)
    } catch {
      setErr('Failed to assign staff member.')
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Users size={15} className="text-sky-500" />
          Case Team
        </h4>
        {isOpen && canAssign && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-sky-600
                       hover:text-sky-700 transition"
          >
            <UserPlus size={13} />
            Add member
          </button>
        )}
      </div>

      {/* add member row */}
      {adding && (
        <div className="flex gap-2 items-center">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2
                       text-sm text-slate-800 bg-white focus:outline-none
                       focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">Select physician / surgeon…</option>
            {eligible.map(s => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} — {s.role}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssign}
            disabled={!selected || isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600
                       hover:bg-sky-700 disabled:opacity-50 text-white text-sm
                       font-medium transition"
          >
            {isPending
              ? <Loader2 size={13} className="animate-spin" />
              : <UserPlus size={13} />
            }
            Assign
          </button>
          <button
            onClick={() => { setAdding(false); setSelected(''); setErr('') }}
            className="px-3 py-2 rounded-lg border border-slate-300 text-sm
                       text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {err && <p className="text-xs text-red-600">{err}</p>}

      {/* team list */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
          <Loader2 size={13} className="animate-spin" /> Loading team…
        </div>
      ) : assignments.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center">
          No team members assigned yet
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {assignments.map(a => (
            <div key={a.id}
              className="flex items-center justify-between px-3 py-2.5
                         rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700
                                flex items-center justify-center text-xs font-semibold">
                  {a.first_name[0]}{a.last_name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {a.first_name} {a.last_name}
                  </p>
                  <p className="text-xs text-slate-400">
                    Added {new Date(a.assigned_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                border capitalize
                                ${ROLE_STYLE[a.role] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {a.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}