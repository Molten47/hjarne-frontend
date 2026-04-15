import { Users, Calendar, FolderOpen, Pill, UserCog, Stethoscope } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import type { Role } from '@/types'

interface Props {
  role: Role
  data: {
    totalPatients:     number
    todayAppointments: number
    myAppointments:    number
    openCases:         number
    pharmacyQueue:     number
    staffCount:        number
  }
  loading: Record<string, boolean>
}

export const StatsRow = ({ role, data, loading }: Props) => {
  const isLoading = Object.values(loading).some(Boolean)
  const v = (n: number) => isLoading ? '—' : n

  const statMap: Record<Role, React.ReactNode> = {
    admin: <>
      <StatCard label="Total Patients"       value={v(data.totalPatients)}     icon={Users}        color="sky"     trend="All registered" />
      <StatCard label="Today's Appointments" value={v(data.todayAppointments)} icon={Calendar}     color="emerald" trend={dateLabel()} />
      <StatCard label="Open Cases"           value={v(data.openCases)}         icon={FolderOpen}   color="violet"  trend="Active cases" />
      <StatCard label="Staff On Record"      value={v(data.staffCount)}        icon={UserCog}      color="amber"   trend="All active staff" />
    </>,

    physician: <>
      <StatCard label="My Appointments Today" value={v(data.myAppointments)}    icon={Calendar}     color="sky"     trend={dateLabel()} />
      <StatCard label="Total Patients"         value={v(data.totalPatients)}     icon={Users}        color="emerald" trend="In the system" />
      <StatCard label="Open Cases"             value={v(data.openCases)}         icon={FolderOpen}   color="violet"  trend="Assigned to you" />
      <StatCard label="Pharmacy Queue"         value={v(data.pharmacyQueue)}     icon={Pill}         color="amber"   trend="Awaiting dispensation" />
    </>,

    surgeon: <>
      <StatCard label="My Procedures Today"  value={v(data.myAppointments)}    icon={Stethoscope}  color="sky"     trend={dateLabel()} />
      <StatCard label="Total Patients"       value={v(data.totalPatients)}     icon={Users}        color="emerald" trend="In the system" />
      <StatCard label="Open Cases"           value={v(data.openCases)}         icon={FolderOpen}   color="violet"  trend="Assigned to you" />
      <StatCard label="Pharmacy Queue"       value={v(data.pharmacyQueue)}     icon={Pill}         color="amber"   trend="Awaiting dispensation" />
    </>,

    nurse: <>
      <StatCard label="Today's Appointments" value={v(data.todayAppointments)} icon={Calendar}     color="sky"     trend={dateLabel()} />
      <StatCard label="Total Patients"       value={v(data.totalPatients)}     icon={Users}        color="emerald" trend="Registered" />
      <StatCard label="Open Cases"           value={v(data.openCases)}         icon={FolderOpen}   color="violet"  trend="Active" />
      <StatCard label="Pharmacy Queue"       value={v(data.pharmacyQueue)}     icon={Pill}         color="amber"   trend="Pending" />
    </>,

    pharmacist: <>
      <StatCard label="Prescription Queue"   value={v(data.pharmacyQueue)}     icon={Pill}         color="sky"     trend="Approved, awaiting dispense" />
      <StatCard label="Total Patients"       value={v(data.totalPatients)}     icon={Users}        color="emerald" trend="In the system" />
      <StatCard label="Staff On Record"      value={v(data.staffCount)}        icon={UserCog}      color="violet"  trend="Active staff" />
      <StatCard label="Today's Visits"       value={v(data.todayAppointments)} icon={Calendar}     color="amber"   trend={dateLabel()} />
    </>,

    desk: <>
      <StatCard label="Today's Appointments" value={v(data.todayAppointments)} icon={Calendar}     color="sky"     trend={dateLabel()} />
      <StatCard label="Total Patients"       value={v(data.totalPatients)}     icon={Users}        color="emerald" trend="Registered" />
      <StatCard label="Staff On Record"      value={v(data.staffCount)}        icon={UserCog}      color="violet"  trend="Active" />
      <StatCard label="Pharmacy Queue"       value={v(data.pharmacyQueue)}     icon={Pill}         color="amber"   trend="Pending" />
    </>,

    patient: <>
      <StatCard label="Upcoming Appointments" value={v(data.myAppointments)}   icon={Calendar}     color="sky"     trend="Scheduled" />
      <StatCard label="Active Cases"          value={v(data.openCases)}        icon={FolderOpen}   color="emerald" trend="Open records" />
    </>,
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {statMap[role]}
    </div>
  )
}

const dateLabel = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  })