import { Plus, UserPlus } from 'lucide-react'
import { RecentPatients }      from '../RecentPatients'
import { AppointmentsSummary } from '../AppointmentsSummary'
import { QuickActions, type Action } from './shared'
import type { WidgetProps } from '../DashboardWidgets'

const ACTIONS: Action[] = [
  { label: 'Open New Case',  icon: Plus,     color: 'bg-violet-600 hover:bg-violet-700', to: '/cases'    },
  { label: 'View Patients',  icon: UserPlus, color: 'bg-sky-600 hover:bg-sky-700',       to: '/patients' },
]

export const PhysicianWidgets = ({ patients, myAppts, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <AppointmentsSummary appointments={myAppts} loading={loading.la}
        title="My Appointments Today" />
    </div>
    <div className="flex flex-col gap-6">
      <QuickActions actions={ACTIONS} />
      <RecentPatients patients={patients.slice(0, 5)} loading={loading.lp} compact />
    </div>
  </div>
)