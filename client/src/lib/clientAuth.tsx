import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, queryClient } from './queryClient';

interface Client {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
}

interface ClientAuthContextType {
  client: Client | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('client_token');
    const storedClient = localStorage.getItem('client_user');
    
    if (storedToken && storedClient) {
      setToken(storedToken);
      setClient(JSON.parse(storedClient));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; client: Client }>('/api/client/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setToken(response.token);
    setClient(response.client);
    localStorage.setItem('client_token', response.token);
    localStorage.setItem('client_user', JSON.stringify(response.client));
  };

  const register = async (email: string, password: string, name: string, company?: string, phone?: string) => {
    const response = await apiRequest<{ token: string; client: Client }>('/api/client/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, company, phone }),
    });

    setToken(response.token);
    setClient(response.client);
    localStorage.setItem('client_token', response.token);
    localStorage.setItem('client_user', JSON.stringify(response.client));
  };

  const logout = () => {
    setClient(null);
    setToken(null);
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_user');
    queryClient.clear();
  };

  return (
    <ClientAuthContext.Provider value={{ client, token, login, register, logout, isLoading }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}

export function getClientAuthToken(): string | null {
  return localStorage.getItem('client_token');
}
