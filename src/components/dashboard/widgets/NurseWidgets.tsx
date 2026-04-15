import { RecentPatients }      from '../RecentPatients'
import { AppointmentsSummary } from '../AppointmentsSummary'
import type { WidgetProps } from '../DashboardWidgets'

export const NurseWidgets = ({ patients, todayAppts, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <AppointmentsSummary appointments={todayAppts} loading={loading.la} />
    </div>
    <RecentPatients patients={patients.slice(0, 4)} loading={loading.lp} compact />
  </div>
)