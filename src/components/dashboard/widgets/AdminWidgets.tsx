import { UserPlus, CalendarPlus, Plus } from 'lucide-react'
import { AppointmentsSummary } from '../AppointmentsSummary'
import { RecentPatients }      from '../RecentPatients'
import { ActiveStaff }         from '../ActiveStaff'
import { PharmacySnapshot }    from '../PharmacySnapshot'
import { QuickNotes }          from '../QuickNotes'
import { QuickActions, type Action } from './shared'
import type { WidgetProps } from '../DashboardWidgets'

const ACTIONS: Action[] = [
  { label: 'Register Patient', icon: UserPlus,     color: 'bg-sky-600 hover:bg-sky-700',         to: '/patients'     },
  { label: 'Book Appointment', icon: CalendarPlus, color: 'bg-emerald-600 hover:bg-emerald-700',  to: '/appointments' },
  { label: 'Open Case',        icon: Plus,         color: 'bg-violet-600 hover:bg-violet-700',    to: '/cases'        },
]

export const AdminWidgets = ({ patients, todayAppts, staff, queue, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

    {/* LEFT — appointments + recent patients */}
    <div className="flex flex-col gap-5">
      <AppointmentsSummary appointments={todayAppts} loading={loading.la} />
      <RecentPatients patients={patients} loading={loading.lp} />
    </div>

    {/* RIGHT — 2x2 flash card grid */}
    <div className="grid grid-cols-2 gap-5 content-start">
      <QuickActions actions={ACTIONS} />
      <QuickNotes />
      <ActiveStaff staff={staff} loading={loading.ls} />
      <PharmacySnapshot queue={queue} loading={loading.lq} />
    </div>

  </div>
)