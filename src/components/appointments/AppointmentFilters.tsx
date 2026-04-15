import { Search, SlidersHorizontal, Calendar } from 'lucide-react'
import type { Staff } from '@/types'

interface Props {
  status:     string
  department: string
  date:       string
  physicianId:string
  physicians: Staff[]
  onStatus:   (v: string) => void
  onDept:     (v: string) => void
  onDate:     (v: string) => void
  onPhysician:(v: string) => void
}

const STATUSES = [
  { value: '',           label: 'All Statuses'  },
  { value: 'scheduled',  label: 'Scheduled'     },
  { value: 'confirmed',  label: 'Confirmed'     },
  { value: 'completed',  label: 'Completed'     },
  { value: 'cancelled',  label: 'Cancelled'     },
  { value: 'no_show',    label: 'No Show'       },
]

const DEPARTMENTS = [
  { value: '',             label: 'All Departments' },
  { value: 'consultation', label: 'Consultation'    },
  { value: 'maternity',    label: 'Maternity'       },
  { value: 'surgery',      label: 'Surgery'         },
  { value: 'mental_health',label: 'Mental Health'   },
  { value: 'general',      label: 'General'         },
]

const selectCls = `pl-3 pr-8 py-2.5 text-sm rounded-lg border border-slate-300
                   bg-white text-slate-700 appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-sky-500
                   focus:border-transparent transition`

export const AppointmentFilters = ({
  status, department, date, physicianId, physicians,
  onStatus, onDept, onDate, onPhysician,
}: Props) => (
  <div className="flex flex-wrap gap-3">

    {/* status */}
    <select value={status} onChange={e => onStatus(e.target.value)}
      className={selectCls}>
      {STATUSES.map(s => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>

    {/* department */}
    <div className="relative">
      <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                               text-slate-400 pointer-events-none" />
      <select value={department} onChange={e => onDept(e.target.value)}
        className={`${selectCls} pl-9`}>
        {DEPARTMENTS.map(d => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
    </div>

    {/* date */}
    <div className="relative">
      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                      text-slate-400 pointer-events-none" />
      <input type="date" value={date} onChange={e => onDate(e.target.value)}
        className={`${selectCls} pl-9`} />
    </div>

{/* physician — admin/desk only */}
    {physicians.length > 0 && (
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                      text-slate-400 pointer-events-none" />
        <select value={physicianId} onChange={e => onPhysician(e.target.value)}
          className={`${selectCls} pl-9`}>
          <option value="">All Physicians</option>
          {physicians.map(p => (
            <option key={p.id} value={p.id}>
              Dr. {p.first_name} {p.last_name}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
)