
import { db, delay } from '../mock/MockData'
import { getScopedPrescriptions } from '../mock/scopeData'
import type { Prescription, DrugStock } from '../types'

export const prescriptionsApi = {
  create: async (caseId: string, payload: {
    items: {
      drug_id:        string
      dosage:         string
      frequency:      string
      route:          string
      duration_days?: number
      instructions?:  string
    }[]
    ai_recommendation?: string
    ai_confidence?:     number
  }): Promise<Prescription> => {
    await delay(400)
    const rx: Prescription = {
      id:                 'rx' + Date.now(),
      case_file_id:       caseId,
      prescribed_by:      's2',
      status:             'pending',
      prescribed_at:      new Date().toISOString(),
      physician_approved: false,
      ai_confidence:      payload.ai_confidence,
      ai_recommendation:  payload.ai_recommendation,
      items: payload.items.map((it, i) => {
        const drug = db.drugStock.find(d => d.drug_id === it.drug_id)
        return {
          id:                       'pi' + Date.now() + i,
          drug_id:                  it.drug_id,
          drug_name:                drug?.name ?? it.drug_id,
          dosage:                   it.dosage,
          frequency:                it.frequency,
          route:                    it.route,
          duration_days:            it.duration_days,
          instructions:             it.instructions,
          contraindication_flagged: false,
          is_controlled:            false,
        }
      }),
    }
    db.prescriptions.unshift(rx)                             // mutations always go to db
    return rx
  },

  queue: async (): Promise<Prescription[]> => {
    await delay()
    return getScopedPrescriptions()                          // ← was db.prescriptions
      .filter(r => r.status === 'pending' || r.status === 'approved')
  },

  dispense: async (id: string): Promise<Prescription> => {
    await delay(300)
    const rx = db.prescriptions.find(r => r.id === id)      // single lookups stay on db
    if (!rx) throw new Error('Prescription not found')
    rx.status = 'dispensed'
    return rx
  },

  stock: async (): Promise<DrugStock[]> => {
    await delay()
    return [...db.drugStock]
  },
}