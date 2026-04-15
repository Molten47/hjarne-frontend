import { useState, useRef } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Send, Paperclip, ArrowLeftRight, StickyNote } from 'lucide-react'
import { useClinicalComms, useSendComm, useInvalidateComms } from '@/hooks/useClinicalComms'
import { casesApi } from '@/api/cases'
import type { ClinicalComm, AttachmentMeta } from '@/types'

import { AttachmentLink } from './AttachmentViewer'

const COMM_TYPE_STYLE: Record<string, string> = {
  note:    'bg-sky-50 text-sky-700 border-sky-200',
  handoff: 'bg-violet-50 text-violet-700 border-violet-200',
  upload:  'bg-amber-50 text-amber-700 border-amber-200',
}

function CommIcon({ type }: { type: string }) {
  if (type === 'note')    return <StickyNote size={11} />
  if (type === 'handoff') return <ArrowLeftRight size={11} />
  return <Paperclip size={11} />
}

interface Props {
  caseId: string
}


export const CommunicationsTab = ({ caseId }: Props) => {
  const { data: comms = [], isLoading } = useClinicalComms(caseId)
  const { mutateAsync: sendComm, isPending } = useSendComm(caseId)

  const [type, setType]       = useState<'note' | 'handoff' | 'upload'>('note')
  const [subject, setSubject] = useState('')
  const [body, setBody]       = useState('')
  const [file, setFile]       = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

const invalidateComms = useInvalidateComms(caseId)

const handleSend = async () => {
  if (!subject.trim() || !body.trim()) return
  if (type === 'upload' && !file) return

  const comm = await sendComm({
    comm_type: type,
    subject: subject.trim(),
    body: body.trim(),
  })

  if (type === 'upload' && file && comm) {
    setUploading(true)
    try {
      await casesApi.uploadAttachment(comm.id, file)
      await invalidateComms()  // refetch so attachment ID comes from DB
    } finally {
      setUploading(false)
    }
  }

  setSubject('')
  setBody('')
  setFile(null)
  if (fileRef.current) fileRef.current.value = ''
}

  const isBusy = isPending || uploading

  return (
    <div className="flex flex-col gap-5">

      <div className="card divide-y divide-slate-100 overflow-hidden">
        {isLoading ? (
          <p className="text-sm text-slate-400 text-center py-10">Loading…</p>
        ) : comms.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">
            No communications yet on this case
          </p>
        ) : (
          comms.map((c: ClinicalComm) => (
            <div key={c.id} className="p-4 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold shrink-0">
                {c.sender.first_name[0]}{c.sender.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {c.sender.first_name} {c.sender.last_name}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{c.sender.role}</span>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${COMM_TYPE_STYLE[c.comm_type]}`}>
                    <CommIcon type={c.comm_type} />
                    {c.comm_type}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">{c.subject}</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.body}</p>
                {c.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.attachments.map((a: AttachmentMeta) => (
                      <AttachmentLink key={a.id} a={a} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card p-5 flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-slate-700">New Communication</h4>

        <div className="flex gap-2">
          {(['note', 'handoff', 'upload'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition ${type === t ? COMM_TYPE_STYLE[t] : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <CommIcon type={t} />
              {t}
            </button>
          ))}
        </div>

        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
        />

        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={4}
          placeholder={
            type === 'note'    ? 'Write your clinical note…' :
            type === 'handoff' ? 'Handoff details — condition, pending tasks, follow-ups…' :
                                 'Describe the uploaded document…'
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition resize-none"
        />

        {type === 'upload' && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 bg-slate-50">
            <Paperclip size={14} className="text-slate-400 shrink-0" />
           <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt,.csv,.xlsx"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-medium file:bg-white file:text-slate-700 hover:file:bg-slate-50 cursor-pointer"
            />
            {file && (
              <span className="text-xs text-slate-500 ml-auto shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={isBusy || !subject.trim() || !body.trim() || (type === 'upload' && !file)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Send size={14} />
            {uploading ? 'Uploading…' : isPending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}