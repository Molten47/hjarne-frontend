import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsApi, type CreatePatientPayload } from '../api/patients'
import type { Patient } from '../types'

export const usePatients = (q?: string) =>
  useInfiniteQuery({
    queryKey:          ['patients', q],
    queryFn:           ({ pageParam }) => patientsApi.list(q, 25, pageParam as string | undefined),
    initialPageParam:  undefined as string | undefined,
    getNextPageParam:  (last) => last.next_cursor ?? undefined,
  })

export const usePatient = (id: string) =>
  useQuery({
    queryKey: ['patients', id],
    queryFn:  () => patientsApi.get(id),
    enabled:  !!id,
  })

export const useCreatePatient = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePatientPayload) => patientsApi.create(payload),

    // fire before the server responds — add a temporary entry instantly
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['patients'] })
      const previous = qc.getQueryData<Patient[]>(['patients', undefined])

      const optimistic: Patient = {
        id:            'temp-' + Date.now(),
        mrn:           'Registering…',
        first_name:    payload.first_name,
        last_name:     payload.last_name,
        date_of_birth: payload.date_of_birth,
        gender:        payload.gender,
        blood_group:   payload.blood_group,
      }

      qc.setQueryData<Patient[]>(
        ['patients', undefined],
        old => [optimistic, ...(old ?? [])]
      )

      return { previous }
    },

    // if server fails — roll back to previous state
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        qc.setQueryData(['patients', undefined], context.previous)
      }
    },

    // whether success or error — always sync with real server data
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}