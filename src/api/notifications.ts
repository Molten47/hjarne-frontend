import { apiClient } from './client'
import type { ApiResponse, Notification } from '../types'

export const notificationsApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<Notification[]>>('/notifications')
    return res.data.data ?? []
  },
  markRead: async (ids: string[]) => {
    await apiClient.post('/notifications/read', { ids })
  },
}