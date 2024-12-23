'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import FriendServices from '@/services/friendServices';
import { notificationsService } from '@/services/notificationsService';
import { chatService } from '@/services/chatService';
import { Chat, Message } from '@/constants/chat';
import { Notification } from '@/constants/notifications';
import { LeaderBoard } from '@/constants/LeaderBoard';
const USER_BASE_URL = 'http://localhost:8080/accounts/';

const USER_PROFILE_BASE_URL = '/user-profile/';

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

interface User {
  id: number;
  display_name: string;
  avatar: string;
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
  PlayerMatches: User[] | null;
  PlayerLeaderBoard: User[] | null;
}

interface UserProfile extends User {
  winRate: number;
  level: number;
  totalWins: number;
  totalGames: number;
}

const userService = {
  // async getUserDetailsByUsername(username: string): Promise<User> {
  //   const response = await userApi.get(`/user-profile/}`);
  //   return response.data;
  // },

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/user-profile/`);
    return response.data;
  },
  async getUserProfile(): Promise<UserProfile> {
    const response = await userApi.get(`${USER_PROFILE_BASE_URL}`);
    return response.data;
  },
  async getPlayerMatches(): Promise<User> {
    const response = await userApi.get(`/user-history/`);
    return response.data;
  },
  async getPlayerLeaderBoard(): Promise<User>{
    const response = await userApi.get(`/leaderboard/`);
    return response.data;
  }
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
  PlayerMatches: null,
  PlayerLeaderBoard: null
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [players, setPlayers] = useState<User[] | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [notificationCount, setNotificationCount] = useState<number | null>(null);  
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [PlayerMatches, setPlayerMatches] = useState<User[] | null>(null);
  const [PlayerLeaderBoard, setPlayerLeaderBoard] = useState<User[] | null>(null);

  const fetchCurrentUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await userService.getUserProfile();
      setUser(userData);
      setUserId(userData.id);
      console.log('userData fetched :', userData);
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
        setPlayers(data.data);
        setIsLoading(false);
      }
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user details'));
      setPlayers(null);
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
  const fetchPlayerMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMatches = await userService.getPlayerMatches();
      setPlayerMatches(fetchedMatches);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch matches'));
      setPlayerMatches(null);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPlayerLeaderBoard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedLeaderBoard = await userService.getPlayerLeaderBoard();
      setPlayerLeaderBoard(fetchedLeaderBoard);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch LeaderBoard'));
      setPlayerLeaderBoard(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
    fetchPlayers();
    fetchNotifications();
    fetchChats();
    fetchPlayerMatches();
    fetchPlayerLeaderBoard();
  }, [user?.username]);

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
        PlayerMatches,
        PlayerLeaderBoard,
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