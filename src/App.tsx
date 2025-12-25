import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';
import { MessengerDashboard } from './pages/messenger/Dashboard';
import { MessengerDonors } from './pages/messenger/Donors';
import { MessengerPrayers } from './pages/messenger/Prayers';
import { MyAssets } from './pages/messenger/MyAssets';
import { MessengerSettings } from './pages/messenger/Settings';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Messengers } from './pages/admin/Messengers';
import { AdminDonors } from './pages/admin/Donors';
import { AdminPrayers } from './pages/admin/Prayers';
import { AdminWithdrawals } from './pages/admin/Withdrawals';
import { AdminLeaderboard } from './pages/admin/Leaderboard';
import { LandingPage } from './pages/public/LandingPage';
import { DonatePage } from './pages/public/DonatePage';

// Placeholder component for routes not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">בקרוב...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes - Entry point is login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Messenger Landing Pages - Public */}
          <Route path="/m/:slug" element={<LandingPage />} />
          <Route path="/m/:slug/donate" element={<DonatePage />} />
          
          {/* Messenger routes */}
          <Route
            path="/messenger/dashboard"
            element={
              <DashboardLayout requiredRole="messenger">
                <MessengerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/donors"
            element={
              <DashboardLayout requiredRole="messenger">
                <MessengerDonors />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/prayers"
            element={
              <DashboardLayout requiredRole="messenger">
                <MessengerPrayers />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/assets"
            element={
              <DashboardLayout requiredRole="messenger">
                <MyAssets />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/settings"
            element={
              <DashboardLayout requiredRole="messenger">
                <MessengerSettings />
              </DashboardLayout>
            }
          />
          
          {/* Donors/Members - NO DASHBOARD ACCESS
              They only pay via external WordPress/Cardcom and are registered in DB
              Only when they buy Tefillin Stand, they become messengers and get access */}
          
          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <DashboardLayout requiredRole="admin">
                <AdminDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/messengers"
            element={
              <DashboardLayout requiredRole="admin">
                <Messengers />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/donors"
            element={
              <DashboardLayout requiredRole="admin">
                <AdminDonors />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/prayers"
            element={
              <DashboardLayout requiredRole="admin">
                <AdminPrayers />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/leaderboard"
            element={
              <DashboardLayout requiredRole="admin">
                <AdminLeaderboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <DashboardLayout requiredRole="admin">
                <AdminWithdrawals />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/campaigns"
            element={
              <DashboardLayout requiredRole="admin">
                <ComingSoon title="ניהול קמפיינים" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <DashboardLayout requiredRole="admin">
                <ComingSoon title="הגדרות מערכת" />
              </DashboardLayout>
            }
          />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
