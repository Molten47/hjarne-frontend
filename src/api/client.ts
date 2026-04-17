// src/api/client.ts — no-op stub (no real HTTP calls in mock mode)
// Kept so imports don't break. Nothing uses it at runtime.
export const apiClient = {
  defaults: { headers: { common: {} as Record<string, string> } },
  interceptors: {
    request:  { use: () => {} },
    response: { use: () => {} },
  },
  get:   async () => ({ data: {} }),
  post:  async () => ({ data: {} }),
  patch: async () => ({ data: {} }),
}