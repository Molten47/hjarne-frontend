import { useState } from 'react'
import { Bell, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import {
  useNotifications,
  useUnreadCount,
} from '@/hooks/useNotifications'

function formatPayload(eventType: string, payload: Record<string, unknown>): string {
  switch (eventType) {
    case 'appointment_scheduled':
      return `New ${payload.department ?? ''} appointment scheduled for ${
        payload.scheduled_at
          ? new Date(payload.scheduled_at as string).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
          : 'an upcoming date'
      }${payload.reason ? ` — ${payload.reason}` : ''}`

    case 'case_opened':
      return `Case ${payload.case_number ?? ''} opened in ${payload.department ?? ''}`

    case 'prescription_dispensed':
      return `Your prescription has been dispensed by pharmacy`

    case 'low_stock_alert':
      return (payload.message as string) ??
        `${payload.drug_name ?? 'A drug'} is low — ${payload.quantity_on_hand ?? '?'} unit(s) remaining`

    default:
      return eventType.replace(/_/g, ' ')
  }
}

function isUrgent(eventType: string): boolean {
  return eventType === 'low_stock_alert'
}

export function NotificationBell() {
  const [open, setOpen]              = useState(false)
  const { data: notifications = [] } = useNotifications()
  const unread                       = useUnreadCount()
  const navigate                     = useNavigate()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative text-slate-400 hover:text-slate-100 transition-colors"
        title="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                           bg-red-500 text-white text-[10px] font-bold
                           flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute left-6 bottom-10 z-50 w-80
                          bg-slate-800 border border-slate-700
                          rounded-xl shadow-xl overflow-hidden">

            <div className="px-4 py-3 border-b border-slate-700">
              <p className="text-sm font-semibold text-slate-100">Notifications</p>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-700">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">
                  No notifications yet
                </p>
              ) : (
                notifications.slice(0, 15).map(n => {
                  const urgent = isUrgent(n.event_type)
                  return (
                    <div
                      key={n.id}
                      className={`px-4 py-3 transition-colors
                        ${urgent
                          ? 'bg-red-950/40 hover:bg-red-950/60 border-l-2 border-l-red-500'
                          : 'hover:bg-slate-700/50'}`}
                    >
                      <p className={`text-xs font-semibold capitalize flex items-center gap-1.5
                                     ${urgent ? 'text-red-400' : 'text-sky-400'}`}>
                        {urgent && <AlertTriangle className="w-3 h-3 shrink-0" />}
                        {n.event_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                        {formatPayload(n.event_type, n.payload)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  )
                })
              )}
            </div>

            <button
              onClick={() => { setOpen(false); navigate('/notifications') }}
              className="w-full px-4 py-2 text-xs text-sky-400 hover:text-sky-300
                         border-t border-slate-700 text-center transition-colors"
            >
              View all notifications →
            </button>
          </div>
        </>
      )}
    </div>
  )
}