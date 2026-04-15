import { useEffect} from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { notificationsApi } from '../api/notifications'
import type { Notification } from '../types'

const WS_URL = 'ws://localhost:3000/api/v1/ws'

// singleton — one socket for the entire app lifetime
let globalWs: WebSocket | null = null
let globalToken: string | null = null

export const useNotificationSocket = () => {
  const { token } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!token) return
    // already connected with same token
    if (
      globalWs &&
      globalToken === token &&
      (globalWs.readyState === WebSocket.OPEN ||
        globalWs.readyState === WebSocket.CONNECTING)
    ) return

    // close old socket if token changed
    if (globalWs) {
      globalWs.onclose = null
      globalWs.close()
      globalWs = null
    }

    globalToken = token
    const ws = new WebSocket(`${WS_URL}?token=${token}`)
    globalWs = ws

    ws.onopen = () => console.info('ws: connected')

    ws.onmessage = (event) => {
      try {
        const evt = JSON.parse(event.data)
        qc.setQueryData<Notification[]>(['notifications'], (prev = []) => [
          {
            id: crypto.randomUUID(),
            event_type: evt.event_type,
            payload: evt.payload,
            status: 'delivered',
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
      } catch {
        console.warn('ws: failed to parse message', event.data)
      }
    }

    ws.onclose = () => {
      console.info('ws: disconnected')
      globalWs = null
      globalToken = null
    }

    ws.onerror = (e) => console.error('ws: error', e)

  }, [token, qc])
}

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
  })

export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useUnreadCount = () => {
  const { data = [] } = useNotifications()
  return data.filter(n => n.status !== 'read').length
}