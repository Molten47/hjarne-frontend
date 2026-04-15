import { apiClient } from './client'
import type { ApiResponse, CaseFile, Diagnosis } from '../types'
import type { ClinicalComm, CaseAssignment }  from '@/types';


export const casesApi = {
list: async (status?: string, cursor?: string) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (cursor) {
      const [time, id] = cursor.split(',')
      params.set('cursor_time', time)
      params.set('cursor_id',   id)
    }
    const res = await apiClient.get<ApiResponse<CaseFile[]>>(`/cases?${params}`)
    return {
      data:        res.data.data ?? [],
      next_cursor: res.data.meta?.next_cursor ?? null,
    }
  },

  open: async (payload: {
    patient_id: string
    physician_id?: string
    department: string
    admission_type?: string
    chief_complaint?: string
  }) => {
    const res = await apiClient.post<ApiResponse<CaseFile>>('/cases', payload)
    return res.data.data!
  },

  get: async (id: string) => {
    const res = await apiClient.get<ApiResponse<CaseFile>>(`/cases/${id}`)
    return res.data.data!
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const res = await apiClient.patch<ApiResponse<CaseFile>>(
      `/cases/${id}/status`,
      { status, notes }
    )
    return res.data.data!
  },

  addDiagnosis: async (caseId: string, payload: {
    icd10_code: string
    description: string
    severity?: string
    notes?: string
  }) => {
    const res = await apiClient.post<ApiResponse<Diagnosis>>(
      `/cases/${caseId}/diagnoses`,
      payload
    )
    return res.data.data!
  },
  listComms: async (caseId: string) => {
    const res = await apiClient.get<ApiResponse<ClinicalComm[]>>(
      `/cases/${caseId}/communications`
    )
    return res.data.data ?? []
  },

  sendComm: async (caseId: string, payload: {
    recipient_id?: string
    comm_type: 'note' | 'handoff' | 'upload'
    subject: string
    body: string
  }) => {
    const res = await apiClient.post<ApiResponse<ClinicalComm>>(
      `/cases/${caseId}/communications`,
      payload
    )
    return res.data.data!
  },

  markCommRead: async (commId: string) => {
    await apiClient.patch(`/communications/${commId}/read`)
  },

  uploadAttachment: async (commId: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    await apiClient.post(`/communications/${commId}/attachment`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

 getAttachmentUrl: (attachmentId: string) =>
    `/api/v1/communications/${attachmentId}/attachment/serve`,

  listAssignments: async (caseId: string) => {
    const res = await apiClient.get<ApiResponse<CaseAssignment[]>>(
      `/cases/${caseId}/assignments`
    )
    return res.data.data ?? []
  },

  assignStaff: async (caseId: string, staff_id: string) => {
    const res = await apiClient.post<ApiResponse<CaseAssignment>>(
      `/cases/${caseId}/assignments`,
      { staff_id }
    )
    return res.data.data!
  },
}