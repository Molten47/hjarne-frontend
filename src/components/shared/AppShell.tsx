import { Outlet } from 'react-router-dom'
import { Sidebar, MobileNav } from './Sidebar'
import { NewsTicker } from './NewsTicker'
import { useNotificationSocket } from '@/hooks/useNotifications'

export const AppShell = () => {
  useNotificationSocket()

  return (
    <div className="flex h-screen bg-slate-50">
      {/* sidebar — fixed height, never scrolls */}
      <Sidebar />

      {/* right side — full height column */}
      <div className="flex-1 flex flex-col h-screen min-w-0">

        {/* ticker — pinned at top, never scrolls */}
        <div className="shrink-0">
          <NewsTicker />
        </div>

        {/* only this scrolls */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}