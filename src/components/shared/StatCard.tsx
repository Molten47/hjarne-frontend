import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  icon:  LucideIcon
  trend?: string
  color?: 'sky' | 'emerald' | 'violet' | 'amber'
}

const colorMap = {
  sky:     'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet:  'bg-violet-50 text-violet-600',
  amber:   'bg-amber-50 text-amber-600',
}

export const StatCard = ({ label, value, icon: Icon, trend, color = 'sky' }: Props) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-5">
    <div className={cn('p-4 rounded-xl', colorMap[color])}>
      <Icon size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-0.5">{value}</p>
      {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
    </div>
  </div>
)