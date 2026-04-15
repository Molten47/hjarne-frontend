import { Pill } from 'lucide-react'
import { QuickActions, SectionTitle, Spinner, Empty, type Action } from './shared'
import type { WidgetProps } from '../DashboardWidgets'

const ACTIONS: Action[] = [
  { label: 'View Full Queue', icon: Pill, color: 'bg-sky-600 hover:bg-sky-700', to: '/pharmacy' },
]

export const PharmacistWidgets = ({ queue, loading }: WidgetProps) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <div className="card p-5">
      <SectionTitle>Prescription Queue</SectionTitle>
      {loading.lq ? <Spinner /> : queue.length === 0 ? (
        <Empty message="No prescriptions pending" />
      ) : (
        <div className="flex flex-col gap-3">
          {queue.slice(0, 8).map(rx => (
            <div key={rx.id}
              className="flex items-center justify-between py-2.5
                         border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900 font-mono">
                  {rx.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(rx.prescribed_at).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium
                               text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                <Pill size={11} />
                Approved
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
    <QuickActions actions={ACTIONS} />
  </div>
)