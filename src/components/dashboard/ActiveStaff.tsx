import type { Staff } from '@/types'

interface Props {
  staff:   Staff[]
  loading: boolean
}

const ROLE_COLOR: Record<string, string> = {
  physician:  'bg-sky-100 text-sky-700',
  surgeon:    'bg-violet-100 text-violet-700',
  nurse:      'bg-emerald-100 text-emerald-700',
  pharmacist: 'bg-amber-100 text-amber-700',
  desk:       'bg-slate-100 text-slate-600',
  admin:      'bg-rose-100 text-rose-700',
}

export const ActiveStaff = ({ staff, loading }: Props) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Active Staff
      </h3>
      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        On Shift
      </span>
    </div>

    {loading ? <Spinner /> : staff.length === 0 ? (
      <p className="text-xs text-slate-400 text-center py-4">No staff on record</p>
    ) : (
      <div className="flex flex-col gap-2">
        {staff.slice(0, 5).map(s => (
          <div key={s.id} className="flex items-center gap-3">
            {/* avatar */}
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600
                            flex items-center justify-center text-xs font-semibold shrink-0">
              {s.first_name[0]}{s.last_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {s.first_name} {s.last_name}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0
                              ${ROLE_COLOR[s.role] ?? 'bg-slate-100 text-slate-600'}`}>
              {s.role}
            </span>
          </div>
        ))}

        {staff.length > 5 && (
          <p className="text-xs text-slate-400 text-center pt-1">
            +{staff.length - 5} more on record
          </p>
        )}
      </div>
    )}
  </div>
)

const Spinner = () => (
  <div className="flex justify-center py-6">
    <div className="w-5 h-5 rounded-full border-2 border-sky-500
                    border-t-transparent animate-spin" />
  </div>
)