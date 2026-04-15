import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePortal } from '@/context/PortalContext'

export const PortalLogin = () => {
  const { login, isLoading } = usePortal()
  const navigate = useNavigate()

  const [mrn,      setMrn]      = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!mrn.trim() || !password) {
      setError('MRN and password are required')
      return
    }
    try {
      await login(mrn.trim(), password)
      navigate('/portal/dashboard')
    } catch {
      setError('Invalid MRN or password')
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
            <p className="text-xs text-slate-400">Patient Portal</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-slate-800 mb-1">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">
          Sign in with your Medical Record Number and password.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Medical Record Number (MRN)
            </label>
            <input
              type="text"
              value={mrn}
              onChange={e => setMrn(e.target.value)}
              placeholder="e.g. MRN-00012"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300
                         text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Your password"
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
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                       text-white text-sm font-semibold transition disabled:opacity-60">
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Access granted via invitation from your care team.
        </p>
      </div>
    </div>
  )
}