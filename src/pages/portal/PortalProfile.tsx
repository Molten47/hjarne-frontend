import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { usePortal } from '@/context/PortalContext'
import { portalApi } from '@/api/portal'
import type { UpdateProfilePayload } from '@/api/portal'
import {
  ArrowLeft, User, MapPin, Phone, Activity,
  CheckCircle, AlertCircle, Pencil, X, Save,
} from 'lucide-react'

const Field = ({
  label, value,
}: { label: string; value: string | number | null | undefined }) => (
  <div>
    <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
    <p className="text-sm text-slate-800 font-medium">
      {value ?? <span className="text-slate-400 font-normal">—</span>}
    </p>
  </div>
)

const Input = ({
  label, value, onChange, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) => (
  <div>
    <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                 text-slate-800 bg-white focus:outline-none focus:ring-2
                 focus:ring-sky-500 focus:border-transparent transition"
    />
  </div>
)

export const PortalProfile = () => {
  const { portalUser } = usePortal()
  const navigate       = useNavigate()
  const qc             = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [toast, setToast]     = useState<{ ok: boolean; msg: string } | null>(null)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['portal-profile'],
    queryFn:  portalApi.getProfile,
  })

  const [form, setForm] = useState<UpdateProfilePayload>({})

  const startEdit = () => {
    if (!profile) return
    setForm({
      nationality:    profile.nationality    ?? '',
      height_cm:      profile.height_cm      ?? undefined,
      weight_kg:      profile.weight_kg      ?? undefined,
      phone:          profile.phone          ?? '',
      email:          profile.email          ?? '',
      address_line1:  profile.address_line1  ?? '',
      address_line2:  profile.address_line2  ?? '',
      city:           profile.city           ?? '',
      state_province: profile.state_province ?? '',
      zip_postal:     profile.zip_postal     ?? '',
      country:        profile.country        ?? '',
    })
    setEditing(true)
  }

  const { mutate: save, isPending } = useMutation({
    mutationFn: () => {
      // strip empty strings → undefined so backend uses COALESCE
      const clean: UpdateProfilePayload = {}
      for (const [k, v] of Object.entries(form)) {
        if (v !== '' && v !== undefined) {
          (clean as any)[k] = v
        }
      }
      return portalApi.updateProfile(clean)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portal-profile'] })
      setEditing(false)
      setToast({ ok: true, msg: 'Profile updated successfully' })
      setTimeout(() => setToast(null), 3000)
    },
    onError: () => {
      setToast({ ok: false, msg: 'Failed to save — please try again' })
      setTimeout(() => setToast(null), 3000)
    },
  })

  const set = (key: keyof UpdateProfilePayload) =>
    (v: string) => setForm(f => ({ ...f, [key]: v }))

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-7 h-7 rounded-full border-2 border-sky-600
                      border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center
                            justify-center text-white font-bold text-sm">H</div>
            <span className="font-semibold text-slate-800">Hjärne HMS</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">Patient Portal</span>
          </div>
          <button onClick={() => navigate('/portal/dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500
                       hover:text-slate-800 transition">
            <ArrowLeft size={15} /> Back
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">MRN: {portalUser?.mrn}</p>
          </div>
          {!editing ? (
            <button onClick={startEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600
                         text-white text-sm font-medium hover:bg-sky-700 transition">
              <Pencil size={14} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                           border border-slate-200 text-slate-600 text-sm
                           hover:bg-slate-50 transition">
                <X size={14} /> Cancel
              </button>
              <button onClick={() => save()} disabled={isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg
                           bg-sky-600 text-white text-sm font-medium
                           hover:bg-sky-700 disabled:opacity-60 transition">
                <Save size={14} />
                {isPending ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* toast */}
        {toast && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm
            ${toast.ok
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {toast.ok
              ? <CheckCircle size={16} />
              : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* identity — always read-only */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-sky-600" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase
                           tracking-wide">Identity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name"     value={profile?.first_name} />
            <Field label="Last name"      value={profile?.last_name} />
            <Field label="Date of birth"  value={profile?.date_of_birth} />
            <Field label="Gender"         value={profile?.gender} />
            <Field label="Blood group"    value={profile?.blood_group} />
            <Field label="Genotype"       value={profile?.genotype} />
            <Field label="Nationality"
              value={!editing ? profile?.nationality : undefined} />
            {editing && (
              <Input label="Nationality"
                value={form.nationality ?? ''}
                onChange={set('nationality')} />
            )}
          </div>
        </section>

        {/* vitals */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-emerald-500" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase
                           tracking-wide">Vitals</h2>
          </div>
          {!editing ? (
            <div className="grid grid-cols-3 gap-4">
              <Field label="Height (cm)" value={profile?.height_cm} />
              <Field label="Weight (kg)" value={profile?.weight_kg} />
              <Field label="BMI"         value={profile?.bmi} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Height (cm)" type="number"
                value={form.height_cm?.toString() ?? ''}
                onChange={v => setForm(f => ({ ...f, height_cm: v ? +v : undefined }))} />
              <Input label="Weight (kg)" type="number"
                value={form.weight_kg?.toString() ?? ''}
                onChange={v => setForm(f => ({ ...f, weight_kg: v ? +v : undefined }))} />
              <div className="col-span-2">
                <p className="text-xs text-slate-400">
                  BMI will be recalculated automatically on save.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* contact */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-amber-500" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase
                           tracking-wide">Contact</h2>
          </div>
          {!editing ? (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone"  value={profile?.phone} />
              <Field label="Email"  value={profile?.email} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={form.phone ?? ''} onChange={set('phone')} />
              <Input label="Email" type="email" value={form.email ?? ''} onChange={set('email')} />
            </div>
          )}
        </section>

        {/* address */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-rose-500" />
            <h2 className="font-semibold text-slate-700 text-sm uppercase
                           tracking-wide">Address</h2>
          </div>
          {!editing ? (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Address line 1"  value={profile?.address_line1} />
              <Field label="Address line 2"  value={profile?.address_line2} />
              <Field label="City"            value={profile?.city} />
              <Field label="State / Province" value={profile?.state_province} />
              <Field label="ZIP / Postal"    value={profile?.zip_postal} />
              <Field label="Country"         value={profile?.country} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Address line 1" value={form.address_line1 ?? ''} onChange={set('address_line1')} />
              <Input label="Address line 2" value={form.address_line2 ?? ''} onChange={set('address_line2')} />
              <Input label="City"           value={form.city ?? ''}          onChange={set('city')} />
              <Input label="State / Province" value={form.state_province ?? ''} onChange={set('state_province')} />
              <Input label="ZIP / Postal"   value={form.zip_postal ?? ''}   onChange={set('zip_postal')} />
              <Input label="Country"        value={form.country ?? ''}       onChange={set('country')} />
            </div>
          )}
        </section>

      </main>
    </div>
  )
}