'use client';
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  ReactNode,
  useState,
  SetStateAction,
} from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  is2FAEnabled: boolean;
  is2FAvalidated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const tfae = localStorage.getItem('otp-enabled');
    const tfav = localStorage.getItem('otp-validated');
    if (storedUser) {
      updateUser({ username: storedUser, is2FAEnabled: tfae === 'True', is2FAvalidated: tfav === 'True'});
    }
    // if (tfae) {
    //   console.log(tfae);
    //   if (tfae === 'True') {
    //     updateUser({ is2FAEnabled: true });
    //   } else {
    //     updateUser({ is2FAEnabled: false });
    //   }
    // }
    // if (tfav) {
    //   console.log(tfav);
    //   if (tfav === 'True') {
    //     updateUser({ is2FAvalidated: true });
    //   } else {
    //     updateUser({ is2FAvalidated: false });
    //   }
    // }
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
    setUser((userData: any) => {
      const updatedUser = { ...userData, ...updates };
      localStorage.setItem('user', updatedUser.username);
      localStorage.setItem('otp-enabled', updatedUser.is2FAEnabled? 'True' : 'False');
      localStorage.setItem('otp-validated', updatedUser.is2FAvalidated? 'True' : 'False');
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
