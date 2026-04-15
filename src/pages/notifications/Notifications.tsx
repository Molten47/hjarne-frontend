import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications, useMarkRead } from '@/hooks/useNotifications'

function formatPayload(eventType: string, payload: Record<string, unknown>): string {
  switch (eventType) {
    case 'appointment_scheduled':
      return `New ${payload.department ?? ''} appointment scheduled for ${
        payload.scheduled_at
          ? new Date(payload.scheduled_at as string).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })
          : 'an upcoming date'
      }${payload.reason ? ` — ${payload.reason}` : ''}`
    case 'case_opened':
      return `Case ${payload.case_number ?? ''} opened in ${payload.department ?? ''}`
    case 'prescription_dispensed':
      return `Your prescription has been dispensed by pharmacy`
    default:
      return eventType.replace(/_/g, ' ')
  }
}

export function Notifications() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markRead, isPending } = useMarkRead()

  const unreadIds = notifications.filter(n => n.status !== 'read').map(n => n.id)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900">
            <Bell className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadIds.length} unread
            </p>
          </div>
        </div>
        {unreadIds.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => markRead(unreadIds)}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading…</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No notifications yet
          </p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`px-5 py-4 flex items-start gap-4 transition-colors
                ${n.status !== 'read' ? 'bg-sky-50 dark:bg-sky-950/30' : 'bg-card'}`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0
                ${n.status !== 'read' ? 'bg-sky-500' : 'bg-transparent'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 capitalize">
                  {n.event_type.replace(/_/g, ' ')}
                </p>
               <p className="text-sm text-foreground mt-0.5">
                   {formatPayload(n.event_type, n.payload)}
               </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}