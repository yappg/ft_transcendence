'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import FriendServices from '@/services/friendServices';

const USER_BASE_URL = 'http://localhost:8080/api';

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  cover?: string;
}

interface UserContextType {
  user: User | null;
  userId: number | null;
  isLoading: boolean;
  error: Error | null;
  players: User[] | null;
  fetchCurrentUserDetails: () => Promise<void>;
  fetchPlayers: () => Promise<User[]>;
}

const userService = {
  async getUserDetailsByUsername(username: string): Promise<User> {
    const response = await userApi.get(`/users/${username}`);
    return response.data;
  },

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/users/me/`);
    return response.data;
  },
};

const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  isLoading: false,
  error: null,
  players: null,
  fetchCurrentUserDetails: async () => {},
  fetchPlayers: async () => [],
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [players, setplayers] = useState<User[] | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await userService.getCurrentUserId();
      setUser(userData);
      setUserId(userData.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch current user'));
      setUser(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await FriendServices.getPlayers();
      if (data.message) {
        setplayers(data.data);
        setIsLoading(false);
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user details'));
      setplayers(null);
    } finally {
      setIsLoading(false);
    }
    return [];
  };

  useEffect(() => {
    fetchCurrentUserDetails();
    fetchPlayers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        isLoading,
        players,
        error,
        fetchCurrentUserDetails,
        fetchPlayers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { userApi, userService };
