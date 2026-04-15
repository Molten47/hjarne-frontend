import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { staffApi } from '../api/staff'

export const useStaff = (filters?: { role?: string; department?: string }) =>
  useQuery({
    queryKey: ['staff', filters],
    queryFn: () => staffApi.list(filters),
  })

export const useCreateStaff = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export const useStaffMember = (id: string) =>
  useQuery({
    queryKey: ['staff', id],
    queryFn:  () => staffApi.get(id),
    enabled:  !!id,
  })

export const useGrantAccess = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ staffId, email, password }: {
      staffId: string
      email: string
      password: string
    }) => staffApi.createAuth(staffId, email, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}