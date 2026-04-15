import { useQuery }   from '@tanstack/react-query'
import { portalApi }  from '@/api/portal'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Video, Clock } from 'lucide-react'

const STATUS_COLOR: Record<string, string> = {
  scheduled:  'bg-sky-100 text-sky-700',
  confirmed:  'bg-emerald-100 text-emerald-700',
  completed:  'bg-slate-100 text-slate-600',
  cancelled:  'bg-red-100 text-red-600',
  no_show:    'bg-amber-100 text-amber-700',
}

export const PortalAppointments = () => {
  const navigate = useNavigate()
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['portal-appointments'],
    queryFn:  portalApi.appointments,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/portal/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-semibold text-slate-800">My Appointments</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 rounded-full border-2 border-sky-500
                            border-t-transparent animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No appointments found
          </div>
        ) : appointments.map(appt => (
          <div key={appt.id}
            className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{appt.department}</p>
                <p className="text-sm text-slate-500 capitalize mt-0.5">
                  {appt.appointment_type.replace('_', ' ')}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                                capitalize ${STATUS_COLOR[appt.status] ?? 'bg-slate-100 text-slate-600'}`}>
                {appt.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {new Date(appt.scheduled_at).toLocaleDateString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
              <span>{appt.duration_minutes} min</span>
            </div>

            {appt.reason && (
              <p className="text-sm text-slate-500 mt-2 italic">"{appt.reason}"</p>
            )}

     {appt.daily_room_url && (appt.status === 'confirmed' || appt.status === 'scheduled') && (
              <a
                href={`/video?room=${encodeURIComponent(appt.daily_room_url)}&role=patient&physician=${encodeURIComponent(appt.physician_name ?? 'Your Physician')}&department=${encodeURIComponent(appt.department)}&scheduled=${encodeURIComponent(appt.scheduled_at)}&duration=${appt.duration_minutes}`}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2
                           bg-sky-600 text-white text-sm font-medium rounded-lg
                           hover:bg-sky-700 transition">
                <Video size={14} /> Join Video Call
              </a>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}