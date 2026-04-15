import { useState } from 'react'
import { Loader2, Lock, ShieldCheck } from 'lucide-react'
import { authApi } from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'

const fieldCls = `w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm
                  text-slate-700 bg-white focus:outline-none focus:ring-2
                  focus:ring-sky-500 focus:border-transparent transition`

export const ChangePassword = () => {
  const { onPasswordChanged, logout } = useAuth()
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [error, setError]             = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await authApi.changePassword(password)
      onPasswordChanged()
    } catch {
      setError('Failed to change password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* icon + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14
                          rounded-2xl bg-sky-100 mb-4">
            <ShieldCheck className="w-7 h-7 text-sky-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
          <p className="text-sm text-slate-500 mt-2">
            Your account requires a password change before continuing.
          </p>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8
                        flex flex-col gap-5">

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200
                            rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => { setError(null); setPassword(e.target.value) }}
                  placeholder="Min. 8 characters"
                  className={`${fieldCls} pl-9`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-slate-400" />
                <input
                  type="password"
                  value={confirm}
                  onChange={e => { setError(null); setConfirm(e.target.value) }}
                  placeholder="Repeat your password"
                  className={`${fieldCls} pl-9`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700
                         disabled:opacity-60 text-white text-sm font-medium
                         flex items-center justify-center gap-2 transition mt-1"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Saving…' : 'Set Password & Continue'}
            </button>
          </form>

          <button
            type="button"
            onClick={logout}
            className="text-xs text-slate-400 hover:text-slate-600
                       text-center transition"
          >
            Sign out instead
          </button>
        </div>
      </div>
    </div>
  )
}