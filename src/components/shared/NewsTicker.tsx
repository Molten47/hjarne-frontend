import { useRef, useState } from 'react'
import { Radio } from 'lucide-react'

// Static headlines for now — will be replaced with WebSocket feed later
const HEADLINES = [
  'Flu season alert: Increased patient volumes expected across consultation departments this week',
  'Pharmacy reminder: Hydrocodone stock running low — reorder threshold reached',
  'System notice: Scheduled maintenance window Sunday 02:00–04:00 EST',
  'Clinical update: New hand hygiene protocol effective Monday across all wards',
  'Staff notice: Monthly rounds meeting rescheduled to Thursday 14:00 in Conference Room B',
  'Health Canada advisory: Updated dosage guidelines for Metformin in renal patients',
]

export const NewsTicker = () => {
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  // duplicate headlines so the scroll loops seamlessly
  const items = [...HEADLINES, ...HEADLINES]

  return (
    <div
      className="flex items-center bg-slate-900 text-slate-100
                 border-b border-slate-700 h-9 overflow-hidden shrink-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* label badge */}
      <div className="flex items-center gap-1.5 px-3 shrink-0
                      border-r border-slate-700 h-full bg-sky-600">
        <Radio size={12} className="animate-pulse" />
        <span className="text-xs font-semibold tracking-wide uppercase">
          Live
        </span>
      </div>

      {/* scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={tickerRef}
          className="flex gap-0 whitespace-nowrap"
          style={{
            animation: isPaused
              ? 'none'
              : 'ticker 60s linear infinite',
          }}
        >
          {items.map((headline, i) => (
            <span key={i} className="text-xs text-slate-300 px-8 inline-flex items-center gap-2">
              <span className="text-sky-400 select-none">◆</span>
              {headline}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}