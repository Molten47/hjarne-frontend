import type { Appointment } from '@/types'

interface Props {
  appointments: Appointment[]
  loading:      boolean
  title?:       string
}

const STATUS_STYLE: Record<string, string> = {
  scheduled:  'bg-sky-100 text-sky-700',
  confirmed:  'bg-emerald-100 text-emerald-700',
  completed:  'bg-slate-100 text-slate-600',
  cancelled:  'bg-red-100 text-red-600',
  no_show:    'bg-amber-100 text-amber-700',
}

export const AppointmentsSummary = ({
  appointments, loading, title = "Today's Appointments"
}: Props) => (
  <div className="card p-5 flex-1">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
      {title}
    </h3>

    {loading ? <Spinner /> : appointments.length === 0 ? (
      <p className="text-sm text-slate-400 text-center py-8">No appointments</p>
    ) : (
      <div className="flex flex-col gap-3">
        {appointments.slice(0, 7).map(a => (
          <div key={a.id}
            className="flex items-start justify-between gap-3
                       pb-3 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="min-w-0">
              {/* on mobile show appointment type + time */}
              <p className="text-sm font-medium text-slate-900 truncate capitalize">
                {a.appointment_type.replace('_', ' ')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.scheduled_at
                  ? new Date(a.scheduled_at).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit',
                    })
                  : '—'}
                {a.department && (
                  <span className="ml-1.5 capitalize">· {a.department}</span>
                )}
              </p>
            </div>
            <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${STATUS_STYLE[a.status] ?? 'bg-slate-100 text-slate-600'}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)

const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-6 h-6 rounded-full border-2 border-sky-500
                    border-t-transparent animate-spin" />
  </div>
)