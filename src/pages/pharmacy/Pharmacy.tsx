import { FlaskConical, ClipboardList, AlertTriangle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { usePharmacyQueue, useDispensePrescription, useDrugStock } from '@/hooks/usePrescriptions'
import { PharmacyStatCards } from '@/components/pharmacy/PharmacyQueue'
import { PrescriptionCard }  from '@/components/pharmacy/PrescriptionCard'
import { DrugStockRow }      from '@/components/pharmacy/DrugStockCard'

export function Pharmacy() {
  const { data: queue = [], isLoading: qLoading }   = usePharmacyQueue()
  const { mutate: dispense, isPending, variables }  = useDispensePrescription()
  const { data: stock = [], isLoading: sLoading }   = useDrugStock()

  const pendingCount = queue.length
  const totalDrugs   = stock.length
  const lowCount     = stock.filter(d => d.is_low).length

  return (
    <div className="px-6 py-5 max-w-screen-2xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center shadow-sm">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pharmacy</h1>
          <p className="text-sm text-slate-500">Dispense queue & drug inventory</p>
        </div>
      </div>

      {/* Stats */}
      <PharmacyStatCards
        pendingCount={pendingCount}
        totalDrugs={totalDrugs}
        lowCount={lowCount}
      />

      {/* Dispense Queue */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Dispense Queue</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {pendingCount === 0
                ? 'No pending prescriptions'
                : `${pendingCount} prescription${pendingCount !== 1 ? 's' : ''} awaiting dispense`}
            </p>
          </div>
          {pendingCount > 0 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-sky-600 text-white">
              {pendingCount} pending
            </span>
          )}
        </div>

        {qLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : queue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50
                          flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-sky-50 border border-sky-100
                            flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">Queue is clear</p>
            <p className="text-xs text-slate-400">No pending prescriptions right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {queue.map(rx => (
              <PrescriptionCard
                key={rx.id}
                prescription={rx}
                onDispense={dispense}
                isDispensing={isPending && variables === rx.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Drug Inventory */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Drug Inventory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {totalDrugs} SKUs tracked{lowCount > 0 && ` · ${lowCount} low stock`}
            </p>
          </div>
          {lowCount > 0 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-500 text-white
                             flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" />{lowCount} low
            </span>
          )}
        </div>

        {sLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stock
              .slice()
              .sort((a, b) => (b.is_low ? 1 : 0) - (a.is_low ? 1 : 0))
              .map(drug => <DrugStockRow key={drug.drug_id} drug={drug} />)}
          </div>
        )}
      </section>

    </div>
  )
}