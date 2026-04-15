import { Outlet, NavLink } from 'react-router-dom'
import { Activity, Calendar, FolderOpen, Mail, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const PATIENT_NAV = [
  { to: '/my/appointments', icon: Calendar,   label: 'Appointments' },
  { to: '/my/cases',        icon: FolderOpen, label: 'My Records'   },
  { to: '/my/messages',     icon: Mail,       label: 'Messages'     },
]

export const PatientShell = () => {
  const {logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* top nav */}
      <header className="bg-white border-b border-slate-200 px-4 py-3
                         flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Activity className="text-sky-600" size={20} />
          <span className="font-display text-slate-900 font-semibold text-base">
            Hjärne HMS
          </span>
        </div>

        {/* desktop nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          {PATIENT_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sky-50 text-sky-700'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-slate-500
                     hover:text-red-500 transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      {/* content */}
      <main className="flex-1 overflow-auto pb-20 sm:pb-0">
        <Outlet />
      </main>

      {/* mobile bottom nav for patients */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-white border-t border-slate-200
                      flex items-center justify-around px-2 pb-safe">
        {PATIENT_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-4 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-sky-600' : 'text-slate-400'
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}