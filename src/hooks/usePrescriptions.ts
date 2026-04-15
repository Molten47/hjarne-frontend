import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { prescriptionsApi } from '../api/prescriptions'

export const usePharmacyQueue = () =>
  useQuery({
    queryKey: ['prescriptions', 'queue'],
    queryFn: prescriptionsApi.queue,
    refetchInterval: 30_000,
  })

export const useCreatePrescription = (caseId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof prescriptionsApi.create>[1]) =>
      prescriptionsApi.create(caseId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prescriptions'] }),
  })
}

export const useDispensePrescription = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => prescriptionsApi.dispense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['prescriptions', 'queue'] }),
  })
}


export const useDrugStock = () =>
  useQuery({
    queryKey: ['drugs', 'stock'],
    queryFn: prescriptionsApi.stock,
  })