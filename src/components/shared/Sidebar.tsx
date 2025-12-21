import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 z-50 order-2">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Desktop Sidebar (Right side for RTL) */}
      <div className="hidden md:flex flex-col h-screen w-64 bg-white border-l border-gray-200 order-1">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">עמידר</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t border-gray-200 p-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>התנתק</span>
          </button>
        </div>
      </div>
    </>
  );
}
