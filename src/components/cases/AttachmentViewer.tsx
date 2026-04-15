import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, FileText } from 'lucide-react'
import { casesApi } from '@/api/cases'
import type { AttachmentMeta } from '@/types'

interface ModalProps {
  a: AttachmentMeta
  onClose: () => void
}

function AttachmentModal({ a, onClose }: ModalProps) {
  const url     = casesApi.getAttachmentUrl(a.id)
  const isPdf   = a.file_type === 'application/pdf'
  const isImage = a.file_type.startsWith('image/')

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col w-[90vw] max-w-4xl h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-800">{a.file_name}</span>
            <span className="text-xs text-slate-400">
              ({(a.file_size / 1024).toFixed(0)} KB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download={a.file_name}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <Download size={12} />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* viewer */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50 rounded-b-2xl">
          {isPdf ? (
            <iframe
              src={url}
              className="w-full h-full rounded-lg border border-slate-200"
              title={a.file_name}
            />
          ) : isImage ? (
            <img
              src={url}
              alt={a.file_name}
              className="max-w-full max-h-full mx-auto rounded-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <FileText size={48} />
              <p className="text-sm">Preview not available for this file type</p>
              <a
                href={url}
                download={a.file_name}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition"
              >
                <Download size={14} />
                Download {a.file_name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

interface LinkProps {
  a: AttachmentMeta
}

export function AttachmentLink({ a }: LinkProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
      >
        <FileText size={11} />
        {a.file_name}
        <span className="text-slate-400">
          ({(a.file_size / 1024).toFixed(0)} KB)
        </span>
      </button>
      {open && <AttachmentModal a={a} onClose={() => setOpen(false)} />}
    </>
  )
}