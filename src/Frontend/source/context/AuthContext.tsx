'use client'
import React, { createContext, useReducer, useContext, useEffect, ReactNode, useState } from 'react';


export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    token: string;
    is2FAEnabled: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void; // For updating specific fields
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const tfa = localStorage.getItem('otp-enabled');
        if (storedUser) {
            updateUser({username: storedUser});
        }
        if (tfa) {
            console.log(tfa);
            updateUser ({is2FAEnabled: (tfa === 'True'? true : false)});
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem('user', userData.username);
        localStorage.setItem('otp-enabled', (userData.is2FAEnabled? 'True' : ''));
        setUser(userData);
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) {
            setUser({} as User);
            return;
        }
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('otp-enabled');
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

