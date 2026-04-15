import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import type { Staff } from '@/types'
import { GrantAccessModal } from'./GrantAcessModal'

const roleColors: Record<string, string> = {
  admin:      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  physician:  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  surgeon:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  nurse:      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  pharmacist: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  desk:       'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

interface Props {
  staff: Staff[]
}

export function StaffTable({ staff }: Props) {
  const [grantTarget, setGrantTarget] = useState<Staff | null>(null)

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">Specialization</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Portal Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {member.first_name} {member.last_name}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {member.staff_code}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize
                    ${roleColors[member.role] ?? 'bg-muted text-muted-foreground'}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground capitalize">
                  {member.department ?? '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.specialization ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={member.is_active ? 'default' : 'secondary'}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {member.has_auth ? (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <ShieldCheck size={13} /> Granted
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1.5"
                      onClick={() => setGrantTarget(member)}
                    >
                      <ShieldOff size={12} />
                      Grant Access
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {grantTarget && (
        <GrantAccessModal
          staff={grantTarget}
          onClose={() => setGrantTarget(null)}
        />
      )}
    </>
  )
}