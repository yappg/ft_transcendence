'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import FriendServices from '@/services/friendServices';
import { notificationsService } from '@/services/notificationsService';
import { chatService } from '@/services/chatService';
import { Chat, Message } from '@/constants/chat';
import { Notification } from '@/constants/notifications';
const USER_BASE_URL = 'http://localhost:8080/api';

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

interface User {
  id: number;
  username: string;
  // Add other user properties as needed
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  userId: number | null;
  isLoading: boolean;
  error: Error | null;
  players: User[] | null;
  chats: Chat[] | null;
  notifications: Notification[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  notificationCount: number;
  fetchCurrentUserDetails: () => Promise<void>;
  fetchPlayers: () => Promise<User[]>;
  fetchNotifications: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  userProfile: UserProfile | null;
  fetchUserProfile: () => Promise<void>;
}

interface UserProfile extends User {
  winRate: number;
  level: number;
  totalWins: number;
  totalGames: number;
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
  async getUserProfile(): Promise<UserProfile> {
    const response = await userApi.get('/users/me/profile');
    return response.data;
  },
};

const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  isLoading: false,
  error: null,
  chats: null,
  players: null,
  messages: [],
  setMessages: () => {},
  notifications: [],
  notificationCount: 0,
  fetchCurrentUserDetails: async () => {},
  fetchPlayers: async () => [],
  fetchNotifications: async () => {},
  setNotifications: () => {},
  setNotificationCount: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [players, setplayers] = useState<User[] | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  const fetchChats = async () => {
    try {
      const fetchedChats = await chatService.getChatList();
      console.log('this is the fetched chat: ', fetchedChats);
      setChats(fetchedChats);
    } catch (error) {
      console.error('Failed to fetch chats or user details', error);
    }
  };

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await FriendServices.getPlayers();
      if (data.message) {
        console.log(data.data);
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
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await notificationsService.getNotifications();
      setNotifications(fetchedNotifications as Notification[]);
      setNotificationCount(fetchedNotifications.length);
      console.log(fetchNotifications);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      setNotifications([]);
      setNotificationCount(0);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userProfile = await userService.getUserDetailsByUsername(user?.username);
      setUserProfile(userProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCurrentUserDetails();
    fetchPlayers();
    fetchNotifications();
    fetchChats();
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        isLoading,
        players,
        error,
        notifications,
        notificationCount,
        chats,
        messages,
        setMessages,
        fetchCurrentUserDetails,
        fetchPlayers,
        fetchNotifications,
        setNotifications,
        setNotificationCount,
        userProfile,
        fetchUserProfile,
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

// Export the userApi and userService for use in other parts of the application
export { userApi, userService };