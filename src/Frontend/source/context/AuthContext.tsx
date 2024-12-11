'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  is2FAEnabled: boolean;
  is2FAvalidated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<User>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const parseBoolean = (value: string | null) => value === 'True';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const is2FAEnabled = parseBoolean(localStorage.getItem('otp-enabled'));
    const is2FAvalidated = parseBoolean(localStorage.getItem('otp-validated'));

    if (storedUser) {
      setUser({
        username: storedUser,
        email: '',
        id: '',
        is2FAEnabled,
        is2FAvalidated,
      });
    }
  }, []);

  const login = (userData: User): Promise<User> => {
    return new Promise<User>((resolve) => {
      localStorage.setItem('user', userData.username);
      localStorage.setItem('otp-enabled', userData.is2FAEnabled ? 'True' : 'False');
      localStorage.setItem('otp-validated', 'False');
      setUser(userData);
      resolve(userData);
    });
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser: any) => {
      if (!prevUser) return null; // No update if user is null
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('user', updatedUser.username);
      localStorage.setItem('otp-enabled', updatedUser.is2FAEnabled ? 'True' : 'False');
      localStorage.setItem('otp-validated', updatedUser.is2FAvalidated ? 'True' : 'False');
      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('otp-enabled');
    localStorage.removeItem('otp-validated');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
