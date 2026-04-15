import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portalApi }   from '@/api/portal'
import { usePortal }   from '@/context/PortalContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'

export const PortalMessages = () => {
  usePortal()
  const navigate  = useNavigate()
  const qc        = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [body, setBody] = useState('')

  const { data: messages = [], isLoading } = useQuery({
    queryKey:        ['portal-messages'],
    queryFn:         portalApi.messages,
    refetchInterval: 10_000,
  })

  // auto-resolve the staff_id from the first staff message in thread
  const resolvedStaffId = messages.find(m => m.sender_type === 'staff')?.staff_id ?? null

  const { mutate: send, isPending } = useMutation({
    mutationFn: () => portalApi.sendMessage(resolvedStaffId!, body),
    onSuccess:  () => {
      setBody('')
      qc.invalidateQueries({ queryKey: ['portal-messages'] })
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const canSend = !!resolvedStaffId && body.trim().length > 0

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/portal/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-semibold text-slate-800">Messages</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-6 py-6 flex-1 flex flex-col gap-4">
        <div className="flex-1 bg-white rounded-xl border border-slate-200
                        p-4 space-y-3 overflow-y-auto min-h-[300px] max-h-[480px]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-sky-500
                              border-t-transparent animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3
                            text-slate-400">
              <MessageCircle size={32} className="opacity-30" />
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs text-center max-w-xs">
                Your care team will reach out here. You'll be able to reply once
                they send you a message.
              </p>
            </div>) : (
            <>
              {/* doctor name banner */}
              {resolvedStaffId && (
                <div className="flex items-center gap-3 pb-3 mb-3
                                border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700
                                  flex items-center justify-center text-sm font-bold shrink-0">
                    {messages.find(m => m.sender_type === 'staff')?.staff_name
                      .split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Dr. {messages.find(m => m.sender_type === 'staff')?.staff_name}
                    </p>
                    <p className="text-xs text-slate-400">Your care team</p>
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id}
                  className={`flex flex-col ${msg.sender_type === 'patient' ? 'items-end' : 'items-start'}`}>
                  {msg.sender_type === 'staff' && (
                    <p className="text-xs text-slate-400 mb-1 ml-1">
                      Dr. {msg.staff_name}
                    </p>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                    ${msg.sender_type === 'patient'
                      ? 'bg-sky-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}>
                    <p>{msg.body}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender_type === 'patient' ? 'text-sky-200' : 'text-slate-400'
                    }`}>
                      {new Date(msg.sent_at).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* compose — only shown once a staff member has messaged first */}
        {resolvedStaffId ? (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex gap-2">
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (canSend && !isPending) send()
                  }
                }}
                placeholder="Type your message…"
                rows={2}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm
                           resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={() => canSend && !isPending && send()}
                disabled={!canSend || isPending}
                className="self-end px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700
                           text-white transition disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          !isLoading && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3
                            text-amber-700 text-sm text-center">
              Replies unlock once your care team sends you a message first.
            </div>
          )
        )}
      </main>
    </div>
  )
}