import { UserPlus, CalendarPlus } from 'lucide-react'
import { RecentPatients }      from '../RecentPatients'
import { AppointmentsSummary } from '../AppointmentsSummary'
import { QuickActions, type Action } from './shared'
import type { WidgetProps } from '../DashboardWidgets'

const ACTIONS: Action[] = [
  { label: 'Register Patient', icon: UserPlus,     color: 'bg-sky-600 hover:bg-sky-700',         to: '/patients'     },
  { label: 'Book Appointment', icon: CalendarPlus, color: 'bg-emerald-600 hover:bg-emerald-700',  to: '/appointments' },
]

export const DeskWidgets = ({ patients, todayAppts, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <AppointmentsSummary appointments={todayAppts} loading={loading.la} />
    </div>
    <div className="flex flex-col gap-6">
      <QuickActions actions={ACTIONS} />
      <RecentPatients patients={patients.slice(0, 4)} loading={loading.lp} compact />
    </div>
  </div>
)