import { useState }   from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { portalApi }  from '@/api/portal'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const PortalComplaints = () => {
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const [subject, setSubject] = useState('')
  const [body,    setBody]    = useState('')
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => portalApi.submitComplaint(subject.trim(), body.trim()),
    onSuccess:  () => {
      setDone(true)
      setSubject('')
      setBody('')
      qc.invalidateQueries({ queryKey: ['portal-complaints'] })
    },
    onError: () => setError('Failed to submit. Please try again.'),
  })

  const handleSubmit = () => {
    setError('')
    if (!subject.trim() || !body.trim()) {
      setError('Subject and message are required')
      return
    }
    submit()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/portal/dashboard')}
            className="text-slate-400 hover:text-slate-700 transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-semibold text-slate-800">Submit a Complaint</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {done ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10
                          text-center">
            <CheckCircle size={40} className="text-emerald-500 mx-auto mb-4" />
            <p className="font-semibold text-slate-800 mb-1">
              Complaint submitted
            </p>
            <p className="text-sm text-slate-500 mb-5">
              Our team will review and respond shortly.
            </p>
            <button onClick={() => setDone(false)}
              className="px-5 py-2 rounded-lg border border-slate-300 text-sm
                         text-slate-600 hover:bg-slate-50 transition">
              Submit another
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <p className="text-sm text-slate-500">
              Use this form to report a concern about your care, hospital experience,
              or any other issue. Your complaint is confidential.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief description of your concern"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm
                           focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Details
              </label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder="Please describe what happened in as much detail as you're comfortable sharing."
                rows={5}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm
                           resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                         text-white text-sm font-semibold transition disabled:opacity-60">
              {isPending ? 'Submitting…' : 'Submit Complaint'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}