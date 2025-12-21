import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/auth/Login';
import { MessengerDashboard } from './pages/messenger/Dashboard';
import { MemberDashboard } from './pages/member/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

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
            path="/messenger/members"
            element={
              <DashboardLayout requiredRole="messenger">
                <ComingSoon title="ניהול מצטרפים" />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/prayers"
            element={
              <DashboardLayout requiredRole="messenger">
                <ComingSoon title="רשימת תפילות" />
              </DashboardLayout>
            }
          />
          <Route
            path="/messenger/settings"
            element={
              <DashboardLayout requiredRole="messenger">
                <ComingSoon title="הגדרות שליח" />
              </DashboardLayout>
            }
          />
          
          {/* Member routes - NO LOGIN REQUIRED (demo mode) */}
          <Route
            path="/member/dashboard"
            element={
              <DashboardLayout requiredRole="member">
                <MemberDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/member/prayers"
            element={
              <DashboardLayout requiredRole="member">
                <ComingSoon title="התפילות שלי" />
              </DashboardLayout>
            }
          />
          <Route
            path="/member/settings"
            element={
              <DashboardLayout requiredRole="member">
                <ComingSoon title="הגדרות מצטרף" />
              </DashboardLayout>
            }
          />
          
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
                <ComingSoon title="ניהול שליחים" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/members"
            element={
              <DashboardLayout requiredRole="admin">
                <ComingSoon title="ניהול מצטרפים" />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/prayers"
            element={
              <DashboardLayout requiredRole="admin">
                <ComingSoon title="ניהול תפילות" />
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
