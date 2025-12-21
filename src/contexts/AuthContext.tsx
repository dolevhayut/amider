import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  mockLogin: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock user in localStorage
    const mockUser = localStorage.getItem('mockUser');
    const mockRole = localStorage.getItem('mockRole') as UserRole | null;
    
    if (mockUser && mockRole) {
      setUser(JSON.parse(mockUser));
      setRole(mockRole);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For now, mock login - will implement real auth later
    console.log('Login attempt:', email, password);
    
    // Try to fetch user from database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (data && !error) {
      setUser(data);
      setRole(data.role);
      localStorage.setItem('mockUser', JSON.stringify(data));
      localStorage.setItem('mockRole', data.role);
    } else {
      throw new Error('User not found');
    }
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockRole');
  };

  const mockLogin = (mockRole: UserRole) => {
    // For development: quick login as different roles
    const mockUser: User = {
      id: `mock-${mockRole}-${Date.now()}`,
      email: `${mockRole}@example.com`,
      full_name: `Mock ${mockRole.charAt(0).toUpperCase() + mockRole.slice(1)}`,
      phone: '050-1234567',
      role: mockRole,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    setRole(mockRole);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockRole', mockRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

