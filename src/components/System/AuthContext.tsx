import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../config/supabase';

interface User {
  username: string;
  name: string;
  role: 'admin' | 'researcher' | 'contributor' | 'viewer';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Shared password for all users (will migrate to Azure SSO)
const SHARED_PASSWORD = '123456Softwares!';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('ezra-auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check password
    if (password !== SHARED_PASSWORD) {
      return false;
    }

    // Look up user in database
    const { data, error } = await supabase
      .from('users')
      .select('email, name, role')
      .eq('email', username)
      .single();

    if (error || !data) {
      return false;
    }

    const userData: User = {
      username: data.email,
      name: data.name,
      role: data.role as User['role']
    };

    setIsAuthenticated(true);
    setUser(userData);

    // Save to localStorage
    localStorage.setItem('ezra-auth', JSON.stringify({
      isAuthenticated: true,
      user: userData
    }));

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('ezra-auth');
  };

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
