import { useQuery }  from '@tanstack/react-query'
import { usePortal } from '@/context/PortalContext'
import { portalApi } from '@/api/portal'
import { useNavigate } from 'react-router-dom'
import { Calendar, FolderOpen, MessageSquare, AlertCircle, LogOut, UserCircle } from 'lucide-react'

export const PortalDashboard = () => {
  const { portalUser, logout } = usePortal()
  const navigate = useNavigate()

  const { data: appointments = [] } = useQuery({
    queryKey: ['portal-appointments'],
    queryFn:  portalApi.appointments,
  })

  const { data: cases = [] } = useQuery({
    queryKey: ['portal-cases'],
    queryFn:  portalApi.cases,
  })

  const today      = new Date().toISOString().split('T')[0]
  const upcoming   = appointments.filter(a =>
    a.scheduled_at >= today && a.status !== 'cancelled'
  )
  const openCases  = cases.filter(c => c.status === 'open')
  const nextAppt   = upcoming[0]

  const handleLogout = () => {
    logout()
    navigate('/portal/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center
                            justify-center text-white font-bold text-sm">H</div>
            <span className="font-semibold text-slate-800">Hjärne HMS</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">Patient Portal</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500
                       hover:text-slate-800 transition">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* greeting */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Hello, {portalUser?.first_name} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            MRN: {portalUser?.mrn}
          </p>
        </div>

        {/* next appointment banner */}
        {nextAppt && (
          <div className="bg-sky-600 rounded-xl p-5 text-white">
            <p className="text-sky-200 text-xs font-medium uppercase tracking-wide mb-1">
              Next Appointment
            </p>
            <p className="text-lg font-semibold">{nextAppt.department}</p>
            <p className="text-sky-100 text-sm mt-0.5">
              {new Date(nextAppt.scheduled_at).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {nextAppt.daily_room_url && nextAppt.status === 'confirmed' && (
              <a href={nextAppt.daily_room_url} target="_blank" rel="noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-white text-sky-600
                           rounded-lg text-sm font-semibold hover:bg-sky-50 transition">
                Join Video Call
              </a>
            )}
          </div>
        )}

        {/* stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Calendar size={20} className="text-sky-600" />,
              label: 'Upcoming appointments',
              value: upcoming.length,
              onClick: () => navigate('/portal/appointments'),
            },
            {
              icon: <FolderOpen size={20} className="text-amber-500" />,
              label: 'Open cases',
              value: openCases.length,
              onClick: () => navigate('/portal/cases'),
            },
            {
              icon: <MessageSquare size={20} className="text-emerald-500" />,
              label: 'Messages',
              value: null,
              onClick: () => navigate('/portal/messages'),
            },
       {
              icon: <AlertCircle size={20} className="text-rose-500" />,
              label: 'Complaints',
              value: null,
              onClick: () => navigate('/portal/complaints'),
            },
            {
              icon: <UserCircle size={20} className="text-violet-500" />,
              label: 'My Profile',
              value: null,
              onClick: () => navigate('/portal/profile'),
            },
          ].map(card => (
            <button key={card.label} onClick={card.onClick}
              className="bg-white rounded-xl p-5 text-left border border-slate-200
                         hover:border-sky-300 hover:shadow-sm transition group">
              <div className="mb-3">{card.icon}</div>
              {card.value !== null && (
                <p className="text-2xl font-bold text-slate-800 mb-0.5">
                  {card.value}
                </p>
              )}
              <p className="text-sm text-slate-500 group-hover:text-slate-700 transition">
                {card.label}
              </p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}