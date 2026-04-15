import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { portalApi } from '@/api/portal'

export const PortalSetup = () => {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const token      = params.get('token') ?? ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!token) {
      setError('Invalid setup link — token missing')
      return
    }
    setLoading(true)
    try {
      await portalApi.setup(token, password)
      setDone(true)
      setTimeout(() => navigate('/portal/login'), 2500)
    } catch {
      setError('This link is invalid or has already been used.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100
                    flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center
                          justify-center text-white font-bold text-lg">H</div>
          <div>
            <p className="font-semibold text-slate-800">Hjärne HMS</p>
            <p className="text-xs text-slate-400">Patient Portal Setup</p>
          </div>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center
                            justify-center mx-auto mb-4 text-2xl">✓</div>
            <p className="font-semibold text-slate-800 mb-1">Account created!</p>
            <p className="text-sm text-slate-500">Redirecting to login…</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-slate-800 mb-1">
              Set up your account
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Choose a password to access your patient portal.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300
                             text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300
                             text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                           text-white text-sm font-semibold transition disabled:opacity-60">
                {loading ? 'Setting up…' : 'Create Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}