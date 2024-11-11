import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  activePage: 'login' | 'signup';
  togglePage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<'login' | 'signup'>('login');

  const togglePage = () => {
    setActivePage((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  return <AuthContext.Provider value={{ activePage, togglePage }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
