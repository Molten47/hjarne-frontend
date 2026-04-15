import { useState } from 'react'
import { useStaff } from '@/hooks/useStaff'
import { StaffTable } from '@/components/staff/StaffTable'
import { StaffCard } from '@/components/staff/StaffCard'
import { NewStaffForm } from '@/components/staff/NewStaffForm'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import { Users, UserPlus } from 'lucide-react'

export function Staff() {
  const { data: staff = [], isLoading } = useStaff()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900">
            <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Staff</h1>
            <p className="text-sm text-muted-foreground">
              {staff.length} team member{staff.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger>
        <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Staff
        </Button>
        </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md overflow-y-auto !bg-white !text-slate-900 border-l !border-slate-100"
      >
        <SheetHeader className="px-6 py-5 border-b border-slate-100">
          <SheetTitle className="text-lg font-semibold !text-slate-900">New Staff Member</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-5">
          <NewStaffForm onSuccess={() => setSheetOpen(false)} />
        </div>
      </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <StaffTable staff={staff} />
          </div>
          <div className="md:hidden space-y-3">
            {staff.map(member => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}