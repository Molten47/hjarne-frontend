import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Video, Mic, MicOff, VideoOff, Phone, PhoneOff,
         Monitor, CheckCircle, Clock, User } from 'lucide-react'

type Phase = 'lobby' | 'call' | 'ended'



export const VideoCall = () => {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const iframeRef  = useRef<HTMLIFrameElement>(null)

  const [phase, setPhase]   = useState<Phase>('lobby')
  const [camOk, setCamOk]   = useState(true)
  const [micOk, setMicOk]   = useState(true)
  const [checking, setChecking] = useState(true)

  const roomUrl       = params.get('room')       ?? ''
  const role          = (params.get('role') ?? 'staff') as 'staff' | 'patient'
  const patientName   = params.get('patient')    ?? 'Patient'
  const physicianName = params.get('physician')  ?? 'Physician'
  const department    = params.get('department') ?? ''
  const scheduledAt   = params.get('scheduled')  ?? ''
  const duration      = Number(params.get('duration') ?? 30)
  const appointmentId = params.get('appt')       ?? ''

  // quick media check in lobby
  useEffect(() => {
    if (phase !== 'lobby') return
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        stream.getTracks().forEach(t => t.stop())
        setCamOk(true); setMicOk(true)
      })
      .catch(() => { setCamOk(false); setMicOk(false) })
      .finally(() => setChecking(false))
  }, [phase])

  // listen for Daily.co iframe events
  useEffect(() => {
    if (phase !== 'call') return
    const handler = (e: MessageEvent) => {
      if (e.data?.action === 'left-meeting') {
        setPhase('ended')
        // auto-complete appointment if staff
        if (role === 'staff' && appointmentId) {
          fetch(`/api/v1/appointments/${appointmentId}/status`, {
            method:  'PATCH',
            headers: {
              'Content-Type':  'application/json',
              'Authorization': `Bearer ${localStorage.getItem('hjarne_token') ?? ''}`,
            },
            body: JSON.stringify({ status: 'completed' }),
          }).catch(() => {})
        }
      }
    }
    window.addEventListener('message', e => handler(e))
    return () => window.removeEventListener('message', handler)
  }, [phase, role, appointmentId])

  if (!roomUrl) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-slate-400">No room URL provided.</p>
    </div>
  )

  // ── ENDED ────────────────────────────────────────────────────────────────────
  if (phase === 'ended') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-800 rounded-2xl p-10 max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center
                        justify-center mx-auto">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-white text-xl font-semibold">Call Ended</h2>
        <p className="text-slate-400 text-sm">
          {role === 'staff'
            ? 'The appointment has been marked as completed.'
            : 'Thank you for your consultation.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700
                     text-white font-medium transition">
          Back
        </button>
      </div>
    </div>
  )

  // ── CALL ─────────────────────────────────────────────────────────────────────
  if (phase === 'call') return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-800
                      border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white text-sm font-medium">
            {role === 'staff' ? patientName : `Dr. ${physicianName}`}
          </span>
          {department && (
            <span className="text-slate-400 text-xs">· {department}</span>
          )}
        </div>
        <button
          onClick={() => setPhase('ended')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg
                     bg-red-600 hover:bg-red-700 text-white text-xs
                     font-medium transition">
          <PhoneOff size={13} /> End Call
        </button>
      </div>

      {/* iframe */}
      <iframe
        ref={iframeRef}
        src={roomUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        className="flex-1 w-full border-0"
        title="Video Call"
      />
    </div>
  )

  // ── LOBBY ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full space-y-6">

        {/* header */}
        <div className="text-center space-y-1">
          <div className="w-14 h-14 rounded-full bg-sky-500/20 flex items-center
                          justify-center mx-auto mb-3">
            <Video size={26} className="text-sky-400" />
          </div>
          <h1 className="text-white text-xl font-semibold">Ready to join?</h1>
          <p className="text-slate-400 text-sm">
            Check your setup before entering the call
          </p>
        </div>

        {/* appointment info */}
        <div className="bg-slate-700/50 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <User size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-300">
              {role === 'staff'
                ? <><span className="text-white font-medium">{patientName}</span></>
                : <>Dr. <span className="text-white font-medium">{physicianName}</span></>
              }
            </span>
          </div>
          {department && (
            <div className="flex items-center gap-2.5 text-sm">
              <Monitor size={14} className="text-slate-400 shrink-0" />
              <span className="text-slate-300 capitalize">{department}</span>
            </div>
          )}
          {scheduledAt && (
            <div className="flex items-center gap-2.5 text-sm">
              <Clock size={14} className="text-slate-400 shrink-0" />
              <span className="text-slate-300">
                {new Date(scheduledAt).toLocaleString('en-US', {
                  weekday: 'short', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
                {' '}· {duration} min
              </span>
            </div>
          )}
        </div>

        {/* device check */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Device Check
          </p>
          {checking ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-slate-500
                              border-t-slate-300 animate-spin" />
              Checking camera & microphone…
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm">
                {camOk
                  ? <Video size={15} className="text-emerald-400" />
                  : <VideoOff size={15} className="text-red-400" />}
                <span className={camOk ? 'text-emerald-400' : 'text-red-400'}>
                  Camera {camOk ? 'ready' : 'not found'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                {micOk
                  ? <Mic size={15} className="text-emerald-400" />
                  : <MicOff size={15} className="text-red-400" />}
                <span className={micOk ? 'text-emerald-400' : 'text-red-400'}>
                  Microphone {micOk ? 'ready' : 'not found'}
                </span>
              </div>
              {(!camOk || !micOk) && (
                <p className="text-xs text-amber-400 mt-1">
                  You can still join — allow browser permissions if prompted.
                </p>
              )}
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-xl border border-slate-600
                       text-slate-300 hover:bg-slate-700 text-sm
                       font-medium transition">
            Cancel
          </button>
          <button
            onClick={() => setPhase('call')}
            disabled={checking}
            className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700
                       text-white text-sm font-medium transition
                       disabled:opacity-50 flex items-center justify-center gap-2">
            <Phone size={15} /> Join Call
          </button>
        </div>
      </div>
    </div>
  )
}