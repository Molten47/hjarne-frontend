import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { casesApi } from '../api/cases'
import type { CaseAssignment } from '@/types'


export const useCases = (status?: string) =>
  useInfiniteQuery({
    queryKey:         ['cases', status],
    queryFn:          ({ pageParam }) => casesApi.list(status, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  })


export const useCase = (id: string) =>
  useQuery({
    queryKey: ['cases', id],
    queryFn: () => casesApi.get(id),
    enabled: !!id,
  })

export const useOpenCase = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: casesApi.open,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
  })
}

export const useUpdateCaseStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      casesApi.updateStatus(id, status, notes),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['cases', id] }),
  })
}

export const useAddDiagnosis = (caseId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { icd10_code: string; description: string; severity?: string; notes?: string }) =>
      casesApi.addDiagnosis(caseId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cases', caseId] }),
  })
}
export const useAssignments = (caseId: string) =>
  useQuery<CaseAssignment[]>({
    queryKey: ['assignments', caseId],
    queryFn:  () => casesApi.listAssignments(caseId),
    enabled:  !!caseId,
  })

export const useAssignStaff = (caseId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (staff_id: string) => casesApi.assignStaff(caseId, staff_id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['assignments', caseId] }),
  })
}