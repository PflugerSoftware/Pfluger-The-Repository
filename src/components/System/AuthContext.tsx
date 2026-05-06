import { createContext, useContext, useState, type ReactNode } from 'react';
import { login as authLogin, type UserProfile } from '../../services/auth';

type User = UserProfile;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialAuth = (() => {
    const savedAuth = localStorage.getItem('ezra-auth');
    if (!savedAuth) return { isAuthenticated: false, user: null as User | null };
    try {
      const authData = JSON.parse(savedAuth);
      return { isAuthenticated: true, user: authData.user as User };
    } catch {
      return { isAuthenticated: false, user: null as User | null };
    }
  })();

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [user, setUser] = useState<User | null>(initialAuth.user);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await authLogin(email, password);
    if (!result.user) return false;

    setIsAuthenticated(true);
    setUser(result.user);
    localStorage.setItem('ezra-auth', JSON.stringify({
      isAuthenticated: true,
      user: result.user,
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
