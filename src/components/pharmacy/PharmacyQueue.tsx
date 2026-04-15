import { ClipboardList, Layers, Activity } from 'lucide-react'

interface Props {
  pendingCount: number
  totalDrugs:   number
  lowCount:     number
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: number | string; sub?: string
  icon: React.ReactNode; accent: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-white p-5
                     shadow-sm flex items-center gap-4 ${accent}`}>
      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center
                      justify-center bg-sky-50 text-sky-600 border border-sky-100">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full
                      bg-sky-50 opacity-60 pointer-events-none" />
    </div>
  )
}

export function PharmacyStatCards({ pendingCount, totalDrugs, lowCount }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Pending Prescriptions"
        value={pendingCount}
        sub="awaiting dispense"
        icon={<ClipboardList className="w-5 h-5" />}
        accent="border-sky-100"
      />
      <StatCard
        label="Drug SKUs"
        value={totalDrugs}
        sub="in inventory"
        icon={<Layers className="w-5 h-5" />}
        accent="border-slate-100"
      />
      <StatCard
        label="Low Stock Alerts"
        value={lowCount}
        sub={lowCount > 0 ? 'reorder needed' : 'all levels healthy'}
        icon={<Activity className="w-5 h-5" />}
        accent={lowCount > 0 ? 'border-red-100' : 'border-slate-100'}
      />
    </div>
  )
}