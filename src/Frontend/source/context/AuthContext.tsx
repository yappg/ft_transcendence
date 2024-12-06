'use client'
import React, { createContext, useReducer, useContext, useEffect, ReactNode, useState } from 'react';


export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    token: string;
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
            updateUser({username: storedUser});
        }
        if (tfae) {
            console.log(tfae);
            if (tfae === 'True') {
                updateUser ({is2FAEnabled: true});
                localStorage.setItem('otp-enabled', 'True')
            }
            else {
                updateUser ({is2FAEnabled: false});
                localStorage.setItem('otp-enabled', 'False')
            }
        }
        if (tfav) {
            console.log(tfav);
            if (tfae === 'True') {
                updateUser ({is2FAvalidated: true});
                localStorage.setItem('otp-enabled', 'True')
            }
            else {
                updateUser ({is2FAvalidated: false});
                localStorage.setItem('otp-enabled', 'False')
            }
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem('user', userData.username);
        localStorage.setItem('otp-enabled', (userData.is2FAEnabled? 'True' : 'False'));
        localStorage.setItem('otp-validated', 'False');
        setUser(userData);
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) {
            setUser({} as User);
            return;
        }
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser.username));
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('otp-enabled');
        localStorage.removeItem('otp-validated');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }} >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
