import { apiClient } from './client'
import { authApi } from './auth'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

export const setupInterceptors = (clearAuth: () => void) => {
  // request — attach access token
  apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('hjarne_token')
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    },
    error => Promise.reject(error)
  )

  // response — handle 401 with refresh rotation
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      const original = error.config

      // not a 401 or already retried — bail
      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error)
      }

      // don't retry login or refresh endpoints themselves
      if (
        original.url?.includes('/auth/login') ||
        original.url?.includes('/auth/refresh')
      ) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      const refreshToken = localStorage.getItem('hjarne_refresh_token')
      if (!refreshToken) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // if already refreshing — queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const data = await authApi.refresh(refreshToken)

        // store new token pair
        localStorage.setItem('hjarne_token', data.access_token)
        localStorage.setItem('hjarne_refresh_token', data.refresh_token)

        apiClient.defaults.headers.common.Authorization =
          `Bearer ${data.access_token}`

        processQueue(null, data.access_token)

        original.headers.Authorization = `Bearer ${data.access_token}`
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}