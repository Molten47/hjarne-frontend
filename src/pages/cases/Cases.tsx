import { useState, useMemo }  from 'react'
import { FolderPlus }         from 'lucide-react'
import { usePatients }        from '@/hooks/usePatients'
import { useStaff }           from '@/hooks/useStaff'
import { PageHeader }         from '@/components/shared/PageHeader'
import { CaseList }           from '@/components/cases/CaseList'
import { CaseDetail }         from '@/components/cases/CaseDetail'
import { OpenCaseForm }       from '@/components/cases/OpenCaseForm'
import type { CaseFile }      from '@/types'
import { useCases } from '@/hooks/useCases'

export const Cases = () => {
const { data: casesData,    isLoading, fetchNextPage: fetchMoreCases, hasNextPage: hasMoreCases } = useCases()
const { data: patientsData }            = usePatients()

const cases    = casesData?.pages.flatMap(p => p.data)    ?? []
const patients = patientsData?.pages.flatMap(p => p.data) ?? []
  const { data: allStaff = [] }           = useStaff()

  const physicians = allStaff.filter(s =>
    s.role === 'physician' || s.role === 'surgeon'
  )

  const [selected,  setSelected]  = useState<CaseFile | null>(null)
  const [statusFilter, setStatus] = useState<string>('open')
  const [showForm,  setShowForm]  = useState(false)

const filtered = useMemo(() => {
    const result = cases.filter(c => !statusFilter || c.status === statusFilter)
    if (selected && !result.find(c => c.id === selected.id)) {
      setSelected(null)
    }
    return result
  }, [cases, statusFilter])

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto">
      <PageHeader
        title="Case Files"
        subtitle={`${cases.length} total · ${cases.filter(c => c.status === 'open').length} open`}
        action={
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700
                       text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
            <FolderPlus size={16} />
            Open Case
          </button>
        }
      />

      {/* status filter tabs */}
      <div className="flex gap-2 mb-5">
        {['all', 'open', 'closed', 'discharged'].map(s => (
          <button key={s} onClick={() => setStatus(s === 'all' ? '' : s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition
                        ${(s === 'all' ? '' : s) === statusFilter
                          ? 'bg-sky-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}>
            {s}
          </button>
        ))}
      </div>

      {/* two-panel layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* left — case list */}
      <div className="xl:col-span-2 flex flex-col gap-3">
          <CaseList
            cases={filtered}
            loading={isLoading}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
          {hasMoreCases && (
            <button
              onClick={() => fetchMoreCases()}
              className="w-full py-2 rounded-lg border border-slate-300 text-sm
                         text-slate-600 hover:bg-slate-50 transition">
              Load more cases
            </button>
          )}
        </div>

        {/* right — case detail */}
        <div className="xl:col-span-3">
          {selected ? (
            <CaseDetail case_={selected} diagnoses={[]} />
          ) : (
            <div className="card p-12 flex flex-col items-center justify-center
                            text-center gap-3 h-full min-h-64">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center
                              justify-center text-2xl">
                📋
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Select a case to view details
              </p>
              <p className="text-slate-400 text-xs">
                Click any case from the list on the left
              </p>
            </div>
          )}
        </div>
      </div>

      <OpenCaseForm
        open={showForm}
        onClose={() => setShowForm(false)}
        patients={patients}
        physicians={physicians}
      />
    </div>
  )
}