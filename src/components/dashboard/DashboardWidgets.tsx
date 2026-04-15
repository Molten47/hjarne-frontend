import type { Role, Patient, Appointment, Prescription, Staff } from '@/types'
import { AdminWidgets }      from './widgets/AdminWidgets'
import { PhysicianWidgets }  from './widgets/PhysicianWidgets'
import { NurseWidgets }      from './widgets/NurseWidgets'
import { PharmacistWidgets } from './widgets/PharmacistWidgets'
import { DeskWidgets }       from './widgets/DeskWidgets'
import { PatientWidgets }    from './widgets/PatientWidgets'

export interface WidgetProps {
  role:         Role
  patients:     Patient[]
  appointments: Appointment[]
  todayAppts:   Appointment[]
  myAppts:      Appointment[]
  queue:        Prescription[]
  staff:        Staff[]
  loading:      Record<string, boolean>
  userId?:      string
}

export const DashboardWidgets = (props: WidgetProps) => {
  const map: Record<Role, React.ReactNode> = {
    admin:      <AdminWidgets      {...props} />,
    physician:  <PhysicianWidgets  {...props} />,
    surgeon:    <PhysicianWidgets  {...props} />,
    nurse:      <NurseWidgets      {...props} />,
    pharmacist: <PharmacistWidgets {...props} />,
    desk:       <DeskWidgets       {...props} />,
    patient:    <PatientWidgets    {...props} />,
  }
  return <>{map[props.role]}</>
}