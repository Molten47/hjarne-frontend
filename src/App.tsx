import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppShell }      from '@/components/shared/AppShell'
import { useAuth }       from '@/hooks/useAuth'
import { usePortal }     from '@/context/PortalContext'
import { PortalProvider } from '@/context/PortalContext'
import { ChangePassword } from '@/pages/auth/ChangePassword'

const Login        = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })))
const Dashboard    = lazy(() => import('@/pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Patients     = lazy(() => import('@/pages/patients/Patients').then(m => ({ default: m.Patients })))
const Appointments = lazy(() => import('@/pages/appointments/Appointments').then(m => ({ default: m.Appointments })))
const Cases        = lazy(() => import('@/pages/cases/Cases').then(m => ({ default: m.Cases })))

const Pharmacy     = lazy(() => import('@/pages/pharmacy/Pharmacy').then(m => ({ default: m.Pharmacy })))
const Staff        = lazy(() => import('@/pages/staff/Staff').then(m => ({ default: m.Staff })))
const Notifications = lazy(() => import('@/pages/notifications/Notifications').then(m => ({ default: m.Notifications })))

const PortalSetup        = lazy(() => import('@/pages/portal/PortalSetup').then(m => ({ default: m.PortalSetup })))
const PortalLogin        = lazy(() => import('@/pages/portal/PortalLogin').then(m => ({ default: m.PortalLogin })))
const PortalDashboard    = lazy(() => import('@/pages/portal/PortalDashboard').then(m => ({ default: m.PortalDashboard })))
const PortalAppointments = lazy(() => import('@/pages/portal/PortalAppointments').then(m => ({ default: m.PortalAppointments })))
const PortalCases        = lazy(() => import('@/pages/portal/PortalCases').then(m => ({ default: m.PortalCases })))
const PortalMessages     = lazy(() => import('@/pages/portal/PortalMessages').then(m => ({ default: m.PortalMessages })))
const PortalComplaints   = lazy(() => import('@/pages/portal/PortalComplaints').then(m => ({ default: m.PortalComplaints })))
const PortalProfile = lazy(() => import('@/pages/portal/PortalProfile').then(m => ({ default: m.PortalProfile })))
const PatientDetail = lazy(() => import('@/pages/patients/PatientDetail').then(m => ({ default: m.PatientDetail })))
const VideoCall     = lazy(() => import('@/pages/video/VideoCall').then(m => ({ default: m.VideoCall })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-sky-600
                      border-t-transparent animate-spin" />
      <p className="text-sm text-slate-400 tracking-wide">Loading…</p>
    </div>
  </div>
)

const Guard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, mustChangePassword } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (mustChangePassword) return <ChangePassword />
  return <>{children}</>
}

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  if (user?.roles?.[0] !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

const PortalGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = usePortal()
  if (!isAuthenticated) return <Navigate to="/portal/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <PortalProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* staff auth */}
            <Route path="/login" element={<Login />} />

            {/* staff shell */}
            <Route element={<Guard><AppShell /></Guard>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"     element={<Dashboard />}    />
              <Route path="patients"      element={<Patients />}     />
              <Route path="appointments"  element={<Appointments />} />
              <Route path="cases"         element={<Cases />}        />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="pharmacy"      element={<Pharmacy />}     />
              <Route path="notifications" element={<Notifications />} />
              <Route path="staff"         element={<AdminOnly><Staff /></AdminOnly>} />
            </Route>

            {/* patient portal — unauthenticated */}
            <Route path="/portal/setup" element={<PortalSetup />} />
            <Route path="/portal/login" element={<PortalLogin />} />

            {/* patient portal — authenticated */}
            <Route path="/portal/dashboard"    element={<PortalGuard><PortalDashboard /></PortalGuard>} />
            <Route path="/portal/appointments" element={<PortalGuard><PortalAppointments /></PortalGuard>} />
            <Route path="/portal/cases"        element={<PortalGuard><PortalCases /></PortalGuard>} />
            <Route path="/portal/messages"     element={<PortalGuard><PortalMessages /></PortalGuard>} />
            <Route path="/portal/complaints"   element={<PortalGuard><PortalComplaints /></PortalGuard>} />
            <Route path="/portal/profile" element={<PortalGuard><PortalProfile /></PortalGuard>} />
              {/* video call — accessible from both staff and portal, no shell */}
            <Route path="/video" element={<VideoCall />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
    
          </Routes>
        </Suspense>
      </PortalProvider>
    </BrowserRouter>
  )
}