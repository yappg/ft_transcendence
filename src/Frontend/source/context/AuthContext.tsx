'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// User interface definition
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

// Create AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to safely parse booleans from localStorage
const parseBoolean = (value: string | null) => value === 'True';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Only run this code on the client side (when component mounts)
    const storedUser = localStorage.getItem('user');
    const is2FAEnabled = parseBoolean(localStorage.getItem('otp-enabled'));
    const is2FAvalidated = parseBoolean(localStorage.getItem('otp-validated'));

    if (storedUser) {
      setUser({
        username: storedUser,
        email: '', // Initialize email if not stored in localStorage
        id: '', // Initialize id if not stored
        is2FAEnabled,
        is2FAvalidated,
      });
    }
  }, []);

  // Handle user login
  const login = (userData: User): Promise<User> => {
    return new Promise<User>((resolve) => {
      localStorage.setItem('user', userData.username);
      localStorage.setItem('otp-enabled', userData.is2FAEnabled ? 'True' : 'False');
      localStorage.setItem('otp-validated', 'False');
      setUser(userData);
      resolve(userData);
    });
  };

  // Update user details
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

  // Handle user logout
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

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
