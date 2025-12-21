import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Settings,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: UserRole;
}

const navItemsByRole = {
  messenger: [
    { to: '/messenger/dashboard', icon: LayoutDashboard, label: 'לוח בקרה' },
    { to: '/messenger/members', icon: Users, label: 'המצטרפים שלי' },
    { to: '/messenger/prayers', icon: Heart, label: 'רשימת תפילות' },
    { to: '/messenger/settings', icon: Settings, label: 'הגדרות' },
  ],
  member: [
    { to: '/member/dashboard', icon: LayoutDashboard, label: 'לוח בקרה' },
    { to: '/member/prayers', icon: Heart, label: 'התפילות שלי' },
    { to: '/member/settings', icon: Settings, label: 'הגדרות' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'סקירה כללית' },
    { to: '/admin/messengers', icon: UserCheck, label: 'ניהול שליחים' },
    { to: '/admin/members', icon: Users, label: 'ניהול מצטרפים' },
    { to: '/admin/prayers', icon: Heart, label: 'תפילות' },
    { to: '/admin/campaigns', icon: TrendingUp, label: 'קמפיינים' },
    { to: '/admin/settings', icon: Settings, label: 'הגדרות' },
  ],
};

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }
  
  if (!user || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  const navItems = navItemsByRole[requiredRole];
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile: Sidebar at bottom, Desktop: Sidebar on right */}
      <main className="flex-1 overflow-y-auto order-1 md:order-2">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Sidebar navItems={navItems} />
    </div>
  );
}

