import { useState, useRef, useEffect }                        from 'react'
import { useParams, useNavigate }          from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Mail, CheckCircle, MessageSquare, Send } from 'lucide-react'
import { apiClient }                       from '@/api/client'
import { portalApi }                       from '@/api/portal'
import { useAuth }                         from '@/hooks/useAuth'
import type { ApiResponse }                from '@/types'
import { patientsApi } from '@/api/patients'

interface PatientFull {
  id:            string
  mrn:           string
  first_name:    string
  last_name:     string
  date_of_birth: string | null
  gender:        string
  blood_group:   string | null
  phone:         string | null
  email:         string | null
  address:       string | null
  portal_active: boolean
}

const BLOOD_COLOR: Record<string, string> = {
  'O+': 'bg-red-50 text-red-600',   'O-': 'bg-red-100 text-red-700',
  'A+': 'bg-sky-50 text-sky-600',   'A-': 'bg-sky-100 text-sky-700',
  'B+': 'bg-violet-50 text-violet-600', 'B-': 'bg-violet-100 text-violet-700',
  'AB+':'bg-emerald-50 text-emerald-600','AB-':'bg-emerald-100 text-emerald-700',
}

export const PatientDetail = () => {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin  = user?.roles?.[0] === 'admin'

const [inviteEmail, setInviteEmail] = useState('')
  const [invited,     setInvited]     = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [msgBody,     setMsgBody]     = useState('')
  const qc        = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)

// PatientDetail.tsx — replace the useQuery block
const { data: patient, isLoading } = useQuery({
  queryKey: ['patient', id],
  queryFn:  () => patientsApi.get(id!),   // ← direct mock API, not apiClient
  enabled:  !!id,
})

  const { data: thread = [] } = useQuery({
    queryKey: ['patient-messages', id],
    queryFn:  () => portalApi.staffGetMessages(id!),
    enabled:  !!id && !!patient?.portal_active,
    refetchInterval: 10_000,
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

const { mutate: sendMsg, isPending: sendingMsg } = useMutation({
    mutationFn: () => portalApi.staffSendMessage(id!, msgBody.trim()),
    onSuccess:  () => {
      setMsgBody('')
      qc.invalidateQueries({ queryKey: ['patient-messages', id] })
    },
  })

  const { mutate: sendInvite, isPending } = useMutation({
    mutationFn: () => portalApi.sendInvite(id!, inviteEmail.trim()),
    onSuccess:  () => { setInvited(true); setInviteError('') },
    onError:    () => setInviteError('Failed to send invite. Check the email and try again.'),
  })

  const handleInvite = () => {
    setInviteError('')
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      setInviteError('Enter a valid email address')
      return
    }
    sendInvite()
  }

  if (isLoading) return (
    <div className="flex justify-center py-32">
      <div className="w-7 h-7 rounded-full border-2 border-sky-500
                      border-t-transparent animate-spin" />
    </div>
  )

  if (!patient) return (
    <div className="flex justify-center py-32 text-slate-400 text-sm">
      Patient not found
    </div>
  )

  return (
    <div className="px-6 py-5 max-w-2xl mx-auto">
      {/* back */}
      <button onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm text-slate-500
                   hover:text-slate-800 transition mb-6">
        <ArrowLeft size={15} /> Back to Patients
      </button>

      {/* header card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700
                          flex items-center justify-center text-lg
                          font-bold shrink-0">
            {patient.first_name[0]}{patient.last_name[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-sm font-mono text-slate-400 mt-0.5">{patient.mrn}</p>
          </div>
          {patient.blood_group && (
            <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full
                              ${BLOOD_COLOR[patient.blood_group] ?? 'bg-slate-100 text-slate-600'}`}>
              {patient.blood_group}
            </span>
          )}
        </div>

        {/* fields */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
          {[
            { label: 'Date of Birth', value: patient.date_of_birth ?? '—' },
            { label: 'Gender',        value: patient.gender ?? '—' },
            { label: 'Phone',         value: patient.phone  ?? '—' },
            { label: 'Email',         value: patient.email  ?? '—' },
            { label: 'Address',       value: patient.address ?? '—' },
            {
              label: 'Portal Access',
              value: patient.portal_active ? 'Active' : 'Not activated',
              highlight: patient.portal_active,
            },
          ].map(f => (
            <div key={f.label}>
              <p className="text-xs font-medium text-slate-400 uppercase
                             tracking-wide mb-0.5">{f.label}</p>
              <p className={`text-slate-800 ${
                f.highlight ? 'text-emerald-600 font-medium' : ''
              }`}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* portal invite — admin only */}
   {/* message patient — chat UI */}
      {patient.portal_active && (
        <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden">
          {/* header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700
                            flex items-center justify-center text-sm font-bold shrink-0">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-xs text-slate-400 font-mono">{patient.mrn}</p>
            </div>
            <MessageSquare size={15} className="ml-auto text-sky-500" />
          </div>

          {/* thread */}
          <div className="px-5 py-4 space-y-3 overflow-y-auto max-h-72 min-h-[120px]
                          bg-slate-50">
            {thread.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                No messages yet — send the first one below.
              </p>
            ) : thread.map(msg => (
              <div key={msg.id}
                className={`flex flex-col ${msg.sender_type === 'staff' ? 'items-end' : 'items-start'}`}>
                {msg.sender_type === 'patient' && (
                  <p className="text-xs text-slate-400 mb-1 ml-1">
                    {patient.first_name}
                  </p>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                  ${msg.sender_type === 'staff'
                    ? 'bg-sky-600 text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}>
                  <p>{msg.body}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender_type === 'staff' ? 'text-sky-200' : 'text-slate-400'
                  }`}>
                    {new Date(msg.sent_at).toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* compose */}
          <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
            <textarea
              value={msgBody}
              onChange={e => setMsgBody(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (msgBody.trim() && !sendingMsg) sendMsg()
                }
              }}
              placeholder={`Message ${patient.first_name}…`}
              rows={2}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300
                         text-sm resize-none focus:outline-none
                         focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => msgBody.trim() && !sendingMsg && sendMsg()}
              disabled={sendingMsg || !msgBody.trim()}
              className="self-end px-4 py-2 rounded-lg bg-sky-600
                         hover:bg-sky-700 text-white transition
                         disabled:opacity-60">
              {sendingMsg ? (
                <div className="w-4 h-4 rounded-full border-2 border-white
                                border-t-transparent animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* portal invite — admin only */}
      {isAdmin && !patient.portal_active && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={16} className="text-sky-600" />
            <h2 className="font-semibold text-slate-800 text-sm">
              Send Portal Invite
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Patient will receive an email with a setup link to activate their portal account.
          </p>

          {invited ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle size={16} />
              Invite sent successfully
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleInvite()}
                placeholder={patient.email ?? 'patient@email.com'}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300
                           text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={handleInvite}
                disabled={isPending}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700
                           text-white text-sm font-medium transition disabled:opacity-60">
                {isPending ? 'Sending…' : 'Send Invite'}
              </button>
            </div>
          )}

          {inviteError && (
            <p className="text-xs text-red-600 mt-2">{inviteError}</p>
          )}
        </div>
      )}
    </div>
  )
}