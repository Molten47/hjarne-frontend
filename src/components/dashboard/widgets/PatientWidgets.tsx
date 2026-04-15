import { AppointmentsSummary } from '../AppointmentsSummary'
import type { WidgetProps } from '../DashboardWidgets'

export const PatientWidgets = ({ myAppts, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <AppointmentsSummary appointments={myAppts} loading={loading.la}
      title="My Upcoming Appointments" />
  </div>
)