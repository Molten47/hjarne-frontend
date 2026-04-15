import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&auto=format&fit=crop&q=80',
    caption: 'Dedicated teams, exceptional care',
  },
  {
    url: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=1200&auto=format&fit=crop&q=80',
    caption: 'Modern facilities built for healing',
  },
  {
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&auto=format&fit=crop&q=80',
    caption: 'Every corridor leads to better outcomes',
  },
  {
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80',
    caption: 'Where precision meets compassion',
  },
  {
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
    caption: 'Advancing medicine, one patient at a time',
  },
]

const INTERVAL = 5000

export const Login = () => {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [current, setCurrent]   = useState(0)
  const [fading, setFading]     = useState(false)
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  // auto-advance with fade
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % IMAGES.length)
        setFading(false)
      }, 400)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      setError('Please enter your credentials.')
      return
    }
    setLoading(true)
    try {
      await login(form.email.trim(), form.password)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: image carousel panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* images — all stacked, opacity driven by current */}
        {IMAGES.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt="Hospital"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
          />
        ))}

        {/* overlay */}
        <div className="absolute inset-0 bg-slate-900/55" />

        {/* content */}
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">

          {/* brand */}
          <div className="flex items-center gap-2.5">
            <Activity className="text-sky-400" size={22} />
            <span className="font-display text-white font-semibold text-xl tracking-tight">
              Hjärne HMS
            </span>
          </div>

          {/* bottom: caption + dots */}
          <div>
            <blockquote
              className="text-white text-2xl font-display font-semibold
                         leading-snug max-w-sm transition-opacity duration-400"
              style={{ opacity: fading ? 0 : 1 }}
            >
              "{IMAGES[current].caption}"
            </blockquote>

            <p className="text-slate-300 text-sm mt-3">
              Trusted by medical teams across North America
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center
                      bg-slate-50 px-6 py-12">

        {/* mobile-only brand */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <Activity className="text-sky-600" size={20} />
          <span className="font-display text-slate-900 font-semibold text-lg">
            Hjärne HMS
          </span>
        </div>

        <div className="w-full max-w-sm">

          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Sign in with your staff credentials to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600
                              text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700"
                     htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={form.email}
                onChange={handleChange}
                placeholder="drhjarne@gmail.com"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5
                           text-sm text-slate-900 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-sky-500
                           focus:border-transparent transition bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700"
                     htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5
                             pr-10 text-sm text-slate-900 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-sky-500
                             focus:border-transparent transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-60
                         text-white font-medium text-sm rounded-lg py-2.5 mt-1
                         flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          <p className="text-xs text-slate-400 text-center mt-8">
            Authorized personnel only · Hjärne HMS v1.0
          </p>
        </div>
      </div>

    </div>
  )
}