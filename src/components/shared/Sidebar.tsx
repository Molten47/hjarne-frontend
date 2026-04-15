import { NavLink} from 'react-router-dom'
import {
  LayoutDashboard, Users, Calendar, FolderOpen,
  Pill, UserCog, LogOut, Activity, MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { NotificationBell } from './NotificationBell'



export const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/patients',     icon: Users,           label: 'Patients'     },
  { to: '/appointments', icon: Calendar,        label: 'Appointments' },
  { to: '/cases',        icon: FolderOpen,      label: 'Cases'        },
  { to: '/pharmacy',     icon: Pill,            label: 'Pharmacy'     },
  { to: '/staff',        icon: UserCog,         label: 'Staff'        },
]



// which tabs appear in the mobile bottom bar per role
const MOBILE_TABS: Record<string, typeof NAV_ITEMS> = {
  admin:      NAV_ITEMS,
  physician:  NAV_ITEMS.filter(n => ['/dashboard','/cases','/appointments','/patients'].includes(n.to)),
  surgeon:    NAV_ITEMS.filter(n => ['/dashboard','/cases','/appointments','/patients'].includes(n.to)),
  nurse:      NAV_ITEMS.filter(n => ['/dashboard','/patients','/cases'].includes(n.to)),
  pharmacist: NAV_ITEMS.filter(n => ['/dashboard','/pharmacy'].includes(n.to)),
  desk:       NAV_ITEMS.filter(n => ['/dashboard','/appointments','/patients'].includes(n.to)),
}

const DESKTOP_NAV: Record<string, typeof NAV_ITEMS> = {
  admin:      NAV_ITEMS,
  physician:  NAV_ITEMS.filter(n => ['/dashboard','/patients','/appointments','/cases'].includes(n.to)),
  surgeon:    NAV_ITEMS.filter(n => ['/dashboard','/patients','/appointments','/cases'].includes(n.to)),
  nurse:      NAV_ITEMS.filter(n => ['/dashboard','/patients','/cases'].includes(n.to)),
  pharmacist: NAV_ITEMS.filter(n => ['/dashboard','/pharmacy'].includes(n.to)),
  desk:       NAV_ITEMS.filter(n => ['/dashboard','/patients','/appointments'].includes(n.to)),
}

// ── desktop sidebar ───────────────────────────────────────
export const Sidebar = () => {
  const { user, logout } = useAuth()
  const role = user?.roles?.[0] as string ?? 'desk'
  const navItems = DESKTOP_NAV[role] ?? NAV_ITEMS

return (
<aside className="hidden lg:flex flex-col w-60 h-screen shrink-0
                  bg-slate-900 text-slate-100 px-3 py-6">
      {/* brand */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <Activity className="text-sky-400" size={22} />
        <span className="font-display text-white font-semibold text-lg tracking-tight">
          Hjärne HMS
        </span>
      </div>

      {/* nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* user footer */}
      <div className="border-t border-slate-800 pt-4 mt-4 px-3
                      flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate capitalize">
            {role}
          </p>
          <p className="text-xs text-slate-500 truncate capitalize">
            {user?.department ?? ''}
          </p>
        </div>
      
       <NotificationBell />
        <button
          onClick={logout}
          className="text-slate-500 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  )
}

// ── mobile bottom tab bar ─────────────────────────────────
export const MobileNav = () => {
  const { user } = useAuth()
  const role = user?.roles?.[0] as string ?? 'desk'
  const tabs = MOBILE_TABS[role] ?? NAV_ITEMS.slice(0, 4)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                    bg-slate-900 border-t border-slate-800
                    flex items-center justify-around px-2 pb-safe">
      {tabs.slice(0, 4).map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-3 py-3 text-xs font-medium transition-colors',
              isActive ? 'text-sky-400' : 'text-slate-500'
            )
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}

      {/* more tab if role has more than 4 items */}
      {tabs.length > 4 && (
        <NavLink
          to="/more"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 px-3 py-3 text-xs font-medium transition-colors',
              isActive ? 'text-sky-400' : 'text-slate-500'
            )
          }
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </NavLink>
      )}
    </nav>
  )
}