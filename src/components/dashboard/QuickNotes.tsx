import { useState } from 'react'
import { StickyNote, Trash2, Plus } from 'lucide-react'

interface Note {
  id:      number
  text:    string
  color:   string
  created: string
}

const NOTE_COLORS = [
  'border-sky-300 bg-sky-50',
  'border-amber-300 bg-amber-50',
  'border-emerald-300 bg-emerald-50',
  'border-violet-300 bg-violet-50',
]

const timestamp = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export const QuickNotes = () => {
  const [notes, setNotes]   = useState<Note[]>([
    {
      id:      1,
      text:    'Follow up with Ethan Caldwell re: lab results',
      color:   NOTE_COLORS[0],
      created: '08:00 AM',
    },
  ])
  const [draft, setDraft]   = useState('')
  const [colorIdx, setColorIdx] = useState(0)

  const addNote = () => {
    if (!draft.trim()) return
    setNotes(prev => [
      ...prev,
      {
        id:      Date.now(),
        text:    draft.trim(),
        color:   NOTE_COLORS[colorIdx % NOTE_COLORS.length],
        created: timestamp(),
      },
    ])
    setDraft('')
    setColorIdx(i => i + 1)
  }

  const deleteNote = (id: number) =>
    setNotes(prev => prev.filter(n => n.id !== id))

  return (
    <div className="card p-4 flex flex-col gap-3">

      {/* header */}
      <div className="flex items-center gap-2">
        <StickyNote size={14} className="text-amber-500" />
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Quick Notes
        </h3>
      </div>

      {/* notes list */}
      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">No notes yet</p>
        ) : (
          notes.map(note => (
            <div key={note.id}
              className={`relative rounded-lg border px-3 py-2 ${note.color}`}>
              <p className="text-xs text-slate-700 leading-relaxed pr-5">
                {note.text}
              </p>
              <p className="text-xs text-slate-400 mt-1">{note.created}</p>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 text-slate-300
                           hover:text-red-400 transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* input */}
      <div className="flex gap-2 items-center border-t border-slate-100 pt-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
          placeholder="Add a note…"
          className="flex-1 text-xs rounded-md border border-slate-200 px-2.5 py-1.5
                     text-slate-800 placeholder:text-slate-400 bg-white
                     focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
        />
        <button
          onClick={addNote}
          className="shrink-0 bg-sky-600 hover:bg-sky-700 text-white
                     rounded-md p-1.5 transition"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  )
}