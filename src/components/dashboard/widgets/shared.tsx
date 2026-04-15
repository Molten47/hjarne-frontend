import { useNavigate } from 'react-router-dom'

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
    {children}
  </h3>
)

export const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-6 h-6 rounded-full border-2 border-sky-500
                    border-t-transparent animate-spin" />
  </div>
)

export const Empty = ({ message }: { message: string }) => (
  <p className="text-sm text-slate-400 text-center py-8">{message}</p>
)

export interface Action {
  label: string
  icon:  React.ElementType
  color: string
  to:    string
}

export const QuickActions = ({ actions }: { actions: Action[] }) => {
  const navigate = useNavigate()
  return (
    <div className="card p-5">
      <SectionTitle>Quick Actions</SectionTitle>
      <div className="flex flex-col gap-2">
        {actions.map(({ label, icon: Icon, color, to }) => (
          <button key={label} onClick={() => navigate(to)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg
                        text-white text-sm font-medium transition ${color}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}