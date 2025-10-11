import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, queryClient } from './queryClient';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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

export function getAuthToken(): string | null {
  return localStorage.getItem('admin_token');
}
