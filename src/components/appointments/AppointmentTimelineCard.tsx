import { Clock, Building2, Wifi, Phone, MapPin, User, Video } from 'lucide-react'
import { usePatient }     from '@/hooks/usePatients'
import { useStaffMember } from '@/hooks/useStaff'
import type { Appointment } from '@/types'

interface Props {
  appointment:    Appointment
  onStatusChange: (id: string, status: string) => void
}

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-sky-100 text-sky-700 border-sky-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
  no_show:   'bg-amber-100 text-amber-700 border-amber-200',
}

const STATUS_DOT: Record<string, string> = {
  scheduled: 'bg-sky-500',
  confirmed: 'bg-emerald-500',
  completed: 'bg-slate-400',
  cancelled: 'bg-red-500',
  no_show:   'bg-amber-500',
}

const CHANNEL_ICON: Record<string, React.ElementType> = {
  in_person:  MapPin,
  telehealth: Wifi,
  phone:      Phone,
}

const NEXT_STATUS: Record<string, { label: string; value: string; color: string }[]> = {
  scheduled: [
    { label: 'Confirm',  value: 'confirmed', color: 'text-emerald-600 hover:bg-emerald-50' },
    { label: 'Cancel',   value: 'cancelled', color: 'text-red-500 hover:bg-red-50'         },
  ],
  confirmed: [
    { label: 'Complete', value: 'completed', color: 'text-slate-600 hover:bg-slate-50'     },
    { label: 'No Show',  value: 'no_show',   color: 'text-amber-600 hover:bg-amber-50'     },
  ],
  completed: [],
  cancelled: [],
  no_show:   [],
}

export const AppointmentTimelineCard = ({ appointment: a, onStatusChange }: Props) => {
  const { data: patient }   = usePatient(a.patient_id)
  const { data: physician } = useStaffMember(a.physician_id ?? '')

  const time = a.scheduled_at
    ? new Date(a.scheduled_at).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit',
      })
    : '—'

  const endTime = a.scheduled_at
    ? new Date(new Date(a.scheduled_at).getTime() + a.duration_minutes * 60000)
        .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '—'

  const ChannelIcon = CHANNEL_ICON[a.channel ?? 'in_person'] ?? MapPin
  const actions     = NEXT_STATUS[a.status] ?? []

  return (
    <div className="flex gap-4 group">

      {/* time column */}
      <div className="w-20 shrink-0 text-right pt-1">
        <p className="text-sm font-semibold text-slate-800">{time}</p>
        <p className="text-xs text-slate-400">{endTime}</p>
      </div>

      {/* timeline spine */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ring-white
                         ${STATUS_DOT[a.status] ?? 'bg-slate-300'}`} />
        <div className="w-px flex-1 bg-slate-200 mt-1" />
      </div>

      {/* card */}
      <div className={`flex-1 mb-4 rounded-xl border p-4 transition-shadow
                       hover:shadow-sm ${STATUS_STYLE[a.status] ?? 'bg-white border-slate-200'}`}>

        {/* top row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-slate-900 capitalize text-sm">
              {a.appointment_type.replace('_', ' ')}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Building2 size={11} />
                <span className="capitalize">{a.department}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={11} />
                {a.duration_minutes} min
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <ChannelIcon size={11} />
                <span className="capitalize">{(a.channel ?? 'in_person').replace('_', ' ')}</span>
              </span>
            </div>
          </div>

          {/* status badge */}
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize
                            ${STATUS_STYLE[a.status]}`}>
            {a.status.replace('_', ' ')}
          </span>
        </div>

        {/* patient + physician */}
        <div className="flex items-center gap-4 mt-2.5 flex-wrap">
          {patient ? (
            <span className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
              <div className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center
                              justify-center text-xs font-bold leading-none">
                {patient.first_name[0]}
              </div>
              {patient.first_name} {patient.last_name}
              <span className="font-mono text-slate-400">{patient.mrn}</span>
            </span>
          ) : (
            <div className="h-4 w-28 bg-current/10 rounded animate-pulse" />
          )}
          {physician && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <User size={11} />
              Dr. {physician.first_name} {physician.last_name}
            </span>
          )}
        </div>

        {/* reason */}
        {a.reason && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {a.reason}
          </p>
        )}

     {/* join call button — telehealth only */}
    {a.daily_room_url && (a.status === 'confirmed' || a.status === 'scheduled') && (
          <div className="mt-3 pt-3 border-t border-current/10">
            <a
              href={`/video?room=${encodeURIComponent(a.daily_room_url)}&role=staff&patient=${encodeURIComponent((patient?.first_name ?? '') + ' ' + (patient?.last_name ?? ''))}&department=${encodeURIComponent(a.department)}&scheduled=${encodeURIComponent(a.scheduled_at)}&duration=${a.duration_minutes}&appt=${a.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-sky-600 text-white text-xs font-medium
                         hover:bg-sky-700 transition">
              <Video size={13} /> Join Video Call
            </a>
          </div>
        )}

        {/* action buttons */}
        {actions.length > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-current/10">
            {actions.map(action => (
              <button key={action.value}
                onClick={() => onStatusChange(a.id, action.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition
                            ${action.color}`}>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}