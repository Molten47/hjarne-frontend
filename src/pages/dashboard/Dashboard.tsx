import { useAuth }          from '@/hooks/useAuth'
import { usePatients }      from '@/hooks/usePatients'
import { useAppointments }  from '@/hooks/useAppointments'
import { usePharmacyQueue } from '@/hooks/usePrescriptions'
import { useStaff }         from '@/hooks/useStaff'
import { useCases }         from '@/hooks/useCases'
import { StatsRow }         from '@/components/dashboard/StatsRow'
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets'
import { PageHeader }       from '@/components/shared/PageHeader'
import type { Role }        from '@/types'

const greet = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const today = new Date().toISOString().split('T')[0]

export const Dashboard = () => {
  const { user } = useAuth()
  const role = user?.roles?.[0] as Role ?? 'desk'

  const { data: patientsData,     isLoading: lp } = usePatients()
  const { data: appointmentsData, isLoading: la } = useAppointments()
  const { data: queue,            isLoading: lq } = usePharmacyQueue()
  const { data: staff,            isLoading: ls } = useStaff()
  const { data: casesData } = useCases('open')

  const patients     = patientsData?.pages.flatMap(p => p.data)     ?? []
  const appointments = appointmentsData?.pages.flatMap(p => p.data) ?? []
  const cases        = casesData?.pages.flatMap(p => p.data)        ?? []

  const todayAppts = appointments.filter(a => a.scheduled_at?.startsWith(today))
  const myAppts    = todayAppts.filter(a => a.physician_id === user?.entity_id)
 const isClinical = role === 'physician' || role === 'surgeon'
 const myCases    = isClinical
  ? cases.filter(c => c.primary_physician_id === user?.entity_id)
  : cases

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto">
      <PageHeader
        title={`${greet()}`}
        subtitle={roleSubtitle(role, user?.department)}
      />
      <StatsRow
        role={role}
        data={{
          totalPatients:     patients.length,
          todayAppointments: todayAppts.length,
          myAppointments:    myAppts.length,
          pharmacyQueue:     queue?.length  ?? 0,
          staffCount:        staff?.length  ?? 0,
          openCases:         myCases.length,
        }}
        loading={{ lp, la, lq, ls }}
      />
      <div className="mt-6">
        <DashboardWidgets
          role={role}
          patients={patients}
          appointments={appointments}
          todayAppts={todayAppts}
          myAppts={myAppts}
          queue={queue ?? []}
          staff={staff ?? []}
          loading={{ lp, la, lq, ls }}
          userId={user?.entity_id}
        />
      </div>
    </div>
  )
}

const roleSubtitle = (role: Role, dept?: string): string => {
  const map: Record<Role, string> = {
    admin:      'System overview — all departments',
    physician:  `${dept ?? 'Consultation'} · Your patients and cases today`,
    surgeon:    `${dept ?? 'Surgery'} · Your scheduled procedures`,
    nurse:      `${dept ?? 'Ward'} · Patient care tasks`,
    pharmacist: 'Pharmacy · Prescription queue and stock',
    desk:       'Front desk · Appointments and patient registration',
    patient:    'Your health summary',
  }
  return map[role] ?? ''
}