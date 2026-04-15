import { Search, SlidersHorizontal } from 'lucide-react'

interface Props {
  search:     string
  department: string
  onSearch:   (v: string) => void
  onDept:     (v: string) => void
}

const DEPARTMENTS = [
  'All Departments',
  'Consultation',
  'Maternity',
  'Surgery',
  'Mental Health',
  'General',
  'Pharmacy',
]

export const PatientFilters = ({ search, department, onSearch, onDept }: Props) => (
  <div className="flex flex-col sm:flex-row gap-3">

    {/* search */}
    <div className="relative flex-1">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2
                                    text-slate-400 pointer-events-none" />
      <input
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search by name or MRN…"
        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300
                   bg-white text-slate-900 placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-sky-500
                   focus:border-transparent transition"
      />
    </div>

    {/* department filter */}
    <div className="relative">
      <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                               text-slate-400 pointer-events-none" />
      <select
        value={department}
        onChange={e => onDept(e.target.value)}
        className="pl-9 pr-8 py-2.5 text-sm rounded-lg border border-slate-300
                   bg-white text-slate-700 appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-sky-500
                   focus:border-transparent transition"
      >
        {DEPARTMENTS.map(d => (
          <option key={d} value={d === 'All Departments' ? '' : d.toLowerCase()}>
            {d}
          </option>
        ))}
      </select>
    </div>
  </div>
)