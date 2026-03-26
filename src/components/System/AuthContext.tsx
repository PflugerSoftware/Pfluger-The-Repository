import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchUserProfile, signIn, signOut, signOutLocal, getSession, onAuthStateChange, type UserProfile } from '../../services/auth';

type User = UserProfile;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and listen for auth state changes
  useEffect(() => {
    // Check for existing session
    getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.email || '');
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    }).catch(async (err) => {
      console.warn('Session recovery failed, clearing stale session:', err);
      try { await signOutLocal(); } catch { /* ignore */ }
      setLoading(false);
    });

    // Subscribe to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.email || '');
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' };
      }

      // Profile will be loaded by the onAuthStateChange listener
      const profile = await fetchUserProfile(data.user.email || '');
      if (!profile) {
        // Auth succeeded but no user profile found in users table
        await signOut();
        return { success: false, error: 'Account not found in team directory' };
      }

      setUser(profile);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Don't render children until initial session check completes
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
