// src/hooks/useNotifications.ts — mock implementation (no WebSocket)
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { notificationsApi } from '../api/notifications'
import type { Notification } from '../types'

// No-op — no real WebSocket in mock mode
export const useNotificationSocket = () => {}

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn:  notificationsApi.list,
  })

export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useUnreadCount = () => {
  const { data = [] } = useNotifications()
  return (data as Notification[]).filter(n => n.status !== 'read').length
}