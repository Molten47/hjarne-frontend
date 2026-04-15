import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi, type CreateAppointmentPayload, type AppointmentFilters } from '../api/appointments'

export const useAppointments = (filters?: AppointmentFilters) =>
  useInfiniteQuery({
    queryKey:         ['appointments', filters],
    queryFn:          ({ pageParam }) => appointmentsApi.list(filters, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.next_cursor ?? undefined,
  })

export const useCreateAppointment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsApi.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      appointmentsApi.updateStatus(id, status, notes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })
}