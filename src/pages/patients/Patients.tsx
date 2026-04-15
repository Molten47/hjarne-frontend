import { useState, useMemo } from 'react'
import { UserPlus }          from 'lucide-react'
import { usePatients }       from '@/hooks/usePatients'
import { PageHeader }        from '@/components/shared/PageHeader'
import { PatientFilters }    from '@/components/patients/PatientFilters'
import { PatientTable }      from '@/components/patients/PatientTable'
import { PatientCard }       from '@/components/patients/PatientCard'
import { NewPatientForm }    from '@/components/patients/NewPatientForm'

export const Patients = () => {
  const { data: patientsData, isLoading,
          fetchNextPage, hasNextPage } = usePatients()

  const patients = patientsData?.pages.flatMap(p => p.data) ?? []

  const [search,   setSearch]   = useState('')
  const [dept,     setDept]     = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = useMemo(() => {
    let list = patients
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q)  ||
        p.mrn.toLowerCase().includes(q)
      )
    }
    return list
  }, [patients, search, dept])

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto">
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} registered patients`}
        action={
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700
                       text-white text-sm font-medium px-4 py-2.5 rounded-lg transition">
            <UserPlus size={16} />
            Register Patient
          </button>
        }
      />

      <div className="mb-5">
        <PatientFilters
          search={search}
          department={dept}
          onSearch={setSearch}
          onDept={setDept}
        />
      </div>

      {/* desktop table */}
      <div className="card p-5 hidden sm:block">
        <PatientTable patients={filtered} loading={isLoading} />
        {hasNextPage && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              className="px-5 py-2 rounded-lg border border-slate-300 text-sm
                         text-slate-600 hover:bg-slate-50 transition">
              Load more patients
            </button>
          </div>
        )}
      </div>

      {/* mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-sky-500
                            border-t-transparent animate-spin" />
          </div>
        ) : filtered.map(p => (
          <PatientCard key={p.id} patient={p} />
        ))}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="w-full py-2 rounded-lg border border-slate-300 text-sm
                       text-slate-600 hover:bg-slate-50 transition">
            Load more patients
          </button>
        )}
      </div>

      <NewPatientForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  )
}