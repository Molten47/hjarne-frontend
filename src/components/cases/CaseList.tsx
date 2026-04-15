import { CaseCard } from './CaseCard'
import type { CaseFile } from '@/types'

interface Props {
  cases:      CaseFile[]
  loading:    boolean
  selectedId: string | null
  onSelect:   (c: CaseFile) => void
}

export const CaseList = ({ cases, loading, selectedId, onSelect }: Props) => {
  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 rounded-full border-2 border-sky-500
                      border-t-transparent animate-spin" />
    </div>
  )

  if (cases.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <p className="text-slate-400 text-sm">No cases found</p>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {cases.map(c => (
        <CaseCard
          key={c.id}
          case_={c}
          selected={c.id === selectedId}
          onClick={() => onSelect(c)}
        />
      ))}
    </div>
  )
}