import { useState, useMemo }          from 'react'
import { CalendarPlus }               from 'lucide-react'
import { useAppointments }            from '@/hooks/useAppointments'
import { useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { usePatients }                from '@/hooks/usePatients'
import { useStaff }                   from '@/hooks/useStaff'
import { PageHeader }                 from '@/components/shared/PageHeader'
import { AppointmentFilters }         from '@/components/appointments/AppointmentFilters'
import { AppointmentTimeline }        from '@/components/appointments/AppointmentTimeline'
import { BookAppointmentSheet }       from '@/components/appointments/BookAppointmentSheet'
import { useAuth }                    from '@/context/AuthContext'

const todayStr = () => new Date().toISOString().split('T')[0]

export const Appointments = () => {
  const { user }                      = useAuth()
  const isAdminOrDesk                 = user?.roles.some(r => r === 'admin' || r === 'desk') ?? false
  const { data: apptData, isLoading,
          fetchNextPage, hasNextPage } = useAppointments()
  const { mutateAsync: updateStatus } = useUpdateAppointmentStatus()
  const { data: patientsData }        = usePatients()
  const { data: allStaff = [] }       = useStaff()

  const appointments = apptData?.pages.flatMap(p => p.data)    ?? []
  const patients     = patientsData?.pages.flatMap(p => p.data) ?? []

  const physicians = allStaff.filter(s =>
    s.role === 'physician' || s.role === 'surgeon'
  )

  const [status,      setStatus]      = useState('')
  const [department,  setDepartment]  = useState('')
  const [date,        setDate]        = useState(todayStr())
  const [physicianId, setPhysicianId] = useState('')
  const [showSheet,   setShowSheet]   = useState(false)

const filtered = useMemo(() =>
    appointments
      .filter(a => !status      || a.status        === status)
      .filter(a => !department  || a.department     === department)
      .filter(a => !isAdminOrDesk || !physicianId || a.physician_id === physicianId)
      .filter(a => !date        || a.scheduled_at?.startsWith(date))
      .sort((a, b) =>
        new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
      ),
    [appointments, status, department, date, physicianId]
  )

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatus({ id, status: newStatus })
  }

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto">
      <PageHeader
        title="Appointments"
        subtitle={`${filtered.length} appointment${filtered.length !== 1 ? 's' : ''} · ${
          date
            ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })
            : 'All dates'
        }`}
        action={
          <button onClick={() => setShowSheet(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700
                       text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
            <CalendarPlus size={16} />
            Book Appointment
          </button>
        }
      />

      <div className="mb-6">
       <AppointmentFilters
          status={status}        department={department}
          date={date}            physicianId={physicianId}
          physicians={isAdminOrDesk ? physicians : []}
          onStatus={setStatus}   onDept={setDepartment}
          onDate={setDate}       onPhysician={setPhysicianId}
        />
      </div>

      <div className="card p-6">
        <AppointmentTimeline
          appointments={filtered}
          loading={isLoading}
          onStatusChange={handleStatusChange}
        />
        {hasNextPage && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              className="px-5 py-2 rounded-lg border border-slate-300 text-sm
                         text-slate-600 hover:bg-slate-50 transition">
              Load more appointments
            </button>
          </div>
        )}
      </div>

      <BookAppointmentSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        patients={patients}
        physicians={physicians}
      />
    </div>
  )
}