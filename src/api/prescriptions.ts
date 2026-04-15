import { apiClient } from './client'
import type { ApiResponse, Prescription, DrugStock } from '../types'

export const prescriptionsApi = {
  create: async (caseId: string, payload: {
    items: {
      drug_id: string
      dosage: string
      frequency: string
      route: string
      duration_days?: number
      instructions?: string
    }[]
    ai_recommendation?: string
    ai_confidence?: number
  }) => {
    const res = await apiClient.post<ApiResponse<Prescription>>(
      `/cases/${caseId}/prescriptions`,
      payload
    )
    
    return res.data.data!
  },

  queue: async () => {
    const res = await apiClient.get<ApiResponse<Prescription[]>>('/prescriptions/queue')
    return res.data.data ?? []
  },

  dispense: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<Prescription>>(
      `/prescriptions/${id}/dispense`,
      {}
    )
    return res.data.data!
  },

  stock: async () => {
  const res = await apiClient.get<ApiResponse<DrugStock[]>>('/drugs/stock')
  return res.data.data ?? []
},
}