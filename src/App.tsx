import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/landing/Home';
import { Login } from './pages/auth/Login';
import { MessengerDashboard } from './pages/messenger/Dashboard';
import { MemberDashboard } from './pages/member/Dashboard';
import { AdminDashboard } from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
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
          
          {/* Member routes */}
          <Route
            path="/member/dashboard"
            element={
              <DashboardLayout requiredRole="member">
                <MemberDashboard />
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
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
