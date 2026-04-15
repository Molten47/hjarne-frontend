import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import type { Staff } from '@/types'
import { GrantAccessModal } from './GrantAcessModal'

const roleColors: Record<string, string> = {
  admin:      'bg-purple-100 text-purple-700',
  physician:  'bg-blue-100 text-blue-700',
  surgeon:    'bg-indigo-100 text-indigo-700',
  nurse:      'bg-green-100 text-green-700',
  pharmacist: 'bg-amber-100 text-amber-700',
  desk:       'bg-slate-100 text-slate-700',
}

interface Props {
  member: Staff
}

export function StaffCard({ member }: Props) {
  const [showGrant, setShowGrant] = useState(false)

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground">
              {member.first_name} {member.last_name}
            </p>
            <p className="text-xs text-muted-foreground font-mono">{member.staff_code}</p>
          </div>
          <Badge variant={member.is_active ? 'default' : 'secondary'}>
            {member.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full font-medium capitalize
            ${roleColors[member.role] ?? 'bg-muted text-muted-foreground'}`}>
            {member.role}
          </span>
          {member.department && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {member.department}
            </span>
          )}
          {member.specialization && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {member.specialization}
            </span>
          )}
        </div>

        <div className="pt-1">
          {member.has_auth ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ShieldCheck size={13} /> Portal access granted
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1.5 w-full"
              onClick={() => setShowGrant(true)}
            >
              <ShieldOff size={12} />
              Grant Portal Access
            </Button>
          )}
        </div>
      </div>

      {showGrant && (
        <GrantAccessModal
          staff={member}
          onClose={() => setShowGrant(false)}
        />
      )}
    </>
  )
}