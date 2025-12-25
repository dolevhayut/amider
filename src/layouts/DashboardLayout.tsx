import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Settings,
  UserCheck,
  TrendingUp,
  Briefcase,
  Wallet,
  Trophy,
  BarChart3
} from 'lucide-react';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: 'messenger' | 'admin';
}

const navItemsByRole = {
  messenger: [
    { to: '/messenger/dashboard', icon: LayoutDashboard, label: 'לוח בקרה' },
    { to: '/messenger/donors', icon: Users, label: 'לקוחות תחתיי' },
    { to: '/messenger/prayers', icon: Heart, label: 'רשימת תפילות' },
    { to: '/messenger/assets', icon: Briefcase, label: 'הנכסים שלי' },
    { to: '/messenger/settings', icon: Settings, label: 'הגדרות' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'סקירה כללית' },
    { to: '/admin/messengers', icon: UserCheck, label: 'ניהול שליחים' },
    { to: '/admin/donors', icon: Users, label: 'ניהול לקוחות' },
    { to: '/admin/prayers', icon: Heart, label: 'תפילות' },
    { to: '/admin/leaderboard', icon: Trophy, label: 'טבלת מובילים' },
    { to: '/admin/analytics', icon: BarChart3, label: 'דוחות וגרפים' },
    { to: '/admin/withdrawals', icon: Wallet, label: 'משיכות' },
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
  
  // Only messengers and admins have access to the system
  if (!user || role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  const navItems = navItemsByRole[requiredRole];
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile: Sidebar at bottom, Desktop: Sidebar on right */}
      <main className="flex-1 overflow-y-auto order-1 md:order-2 pt-14 md:pt-0">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Sidebar navItems={navItems} />
    </div>
  );
}

