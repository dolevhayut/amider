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
  mockLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from our users table
  const fetchUserData = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (data && !error) {
        setUser(data);
        setRole(data.role);
        return data;
      } else {
        console.error('User not found in users table:', error);
        return null;
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Supabase v2: onAuthStateChange fires INITIAL_SESSION on registration
    // So we only need this listener - no separate getSession call needed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      if (!mounted) return;

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          if (!userData && mounted) {
            console.error('Failed to fetch user data');
            // Don't sign out on INITIAL_SESSION - might be a DB issue
            if (event === 'SIGNED_IN') {
              await supabase.auth.signOut();
            }
          }
        }
        if (mounted) setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Fetch user data from our users table
        const userData = await fetchUserData(authData.user.id);
        if (!userData) {
          throw new Error('User profile not found');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const mockLogin = async (mockRole: UserRole) => {
    // For development: Sign in with real accounts
    try {
      let email = '';
      let password = '123456';
      
      if (mockRole === 'messenger') {
        email = 'dolevhayut1994@gmail.com';
      } else if (mockRole === 'admin') {
        email = 'amit@ami-dar.co.il';
      }

      if (email) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authData.user && !authError) {
          await fetchUserData(authData.user.id);
          return;
        }
      }

      // Fallback: fetch a user from DB and set without auth
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', mockRole)
        .limit(1)
        .single();

      if (data && !error) {
        setUser(data);
        setRole(data.role);
      }
    } catch (err) {
      console.error('Error during mock login:', err);
    }
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

