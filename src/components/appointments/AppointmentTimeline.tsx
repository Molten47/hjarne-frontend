import { AppointmentTimelineCard } from './AppointmentTimelineCard'
import type { Appointment } from '@/types'

interface Props {
  appointments:   Appointment[]
  loading:        boolean
  onStatusChange: (id: string, status: string) => void
}

export const AppointmentTimeline = ({ appointments, loading, onStatusChange }: Props) => {
  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-7 h-7 rounded-full border-2 border-sky-500
                      border-t-transparent animate-spin" />
    </div>
  )

  if (appointments.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center
                      justify-center text-slate-400 text-xl">
        📅
      </div>
      <p className="text-slate-500 text-sm font-medium">No appointments found</p>
      <p className="text-slate-400 text-xs">Try adjusting your filters</p>
    </div>
  )

  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    const hour = a.scheduled_at
      ? new Date(a.scheduled_at).toLocaleTimeString('en-US', {
          hour: '2-digit', hour12: true,
        })
      : 'Unscheduled'
    if (!acc[hour]) acc[hour] = []
    acc[hour].push(a)
    return acc
  }, {})

  return (
    <div className="flex flex-col">
      {Object.entries(grouped).map(([hour, appts]) => (
        <div key={hour}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase
                             tracking-wider w-20 text-right shrink-0">
              {hour}
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          {appts.map(a => (
            <AppointmentTimelineCard
              key={a.id}
              appointment={a}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ))}
    </div>
  )
}