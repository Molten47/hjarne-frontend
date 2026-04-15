import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { casesApi } from '../api/cases'

export const useClinicalComms = (caseId: string) =>
  useQuery({
    queryKey: ['comms', caseId],
    queryFn: () => casesApi.listComms(caseId),
    enabled: !!caseId,
  })
export const useInvalidateComms = (caseId: string) => {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['comms', caseId] })
}
export const useSendComm = (caseId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      recipient_id?: string
      comm_type: 'note' | 'handoff' | 'upload'
      subject: string
      body: string
    }) => casesApi.sendComm(caseId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comms', caseId] }),
  })
}