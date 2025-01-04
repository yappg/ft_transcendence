'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { notificationsService } from '@/services/notificationsService';
import { chatService } from '@/services/chatService';
import { Chat, Message } from '@/constants/chat';
import { Notification } from '@/constants/notifications';
import { Achievement } from '@/constants/achivemement';
import { onlineService } from '@/services/onlineService';
import FriendServices from '@/services/friendServices';
const USER_BASE_URL = 'http://localhost:8080/accounts/';

const USER_PROFILE_BASE_URL = '/user-profile/';

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

export interface User {
  id: number;
  username: string;
  xp: number;
  achievements: any[];
  statistics: Statistics;
  last_login: number;
  is_online: boolean;
  display_name: string;
  bio: string;
  avatar: string;
  cover: string;
  level: number;
  total_games: number;
  games_won: number;
  games_loss: number;
  win_ratio: number;
  created_at: Date;
  is_private: boolean;
  relation: string;
  friends: Player[];
  matches_history: History[];
}

export interface Statistics {
  air_ratio: number;
  water_ratio: number;
  fire_ratio: number;
  earth_ratio: number;
  graph_data: GraphDatum[];
}

export interface GraphDatum {
  date: Date;
  wins: number;
  losses: number;
}

export interface History {
  length: number;
  id: number;
  result: string;
  map_played: string;
  player1: Player;
  player2: Player;
  player1_score: number;
  player2_score: number;
  date: string;
}

export interface Player {
  length: number;
  id: number;
  display_name: string;
  level: number;
  avatar: string;
}

export interface LeaderBoard {
  id: number;
  display_name: string;
  level: number;
  avatar: string;
  games_won: number;
  games_loss: number;
}

interface UserContextType {
  user: User | null;
  userId: number;
  isLoading: boolean;
  error: Error | null;
  players: User[] | null;
  chats: Chat[] | null;
  notifications: Notification[] | null;
  messages: Message[] | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
  notificationCount: number;
  fetchCurrentUserDetails: () => Promise<void>;
  setOnlineStatus: () => Promise<void>;
  fetchPlayers: () => Promise<User[]>;
  fetchNotifications: () => Promise<void>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[] | null>>;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  PlayerMatches: History[] | null;
  PlayerLeaderBoard: LeaderBoard[] | null;
  fetchPlayerMatches: () => {};
  fetchPlayerLeaderBoard: () => {};
  achievements: Achievement[] | null;
}

const userService = {
  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/user-profile/`);
    return response.data;
  },
  async getUserProfile(): Promise<User> {
    const response = await userApi.get(`${USER_PROFILE_BASE_URL}`);
    return response.data;
  },
  async getPlayerMatches(): Promise<History[]> {
    const response = await userApi.get(`/user-history/`);
    return response.data;
  },
  async getPlayerLeaderBoard(): Promise<LeaderBoard[]> {
    const response = await userApi.get(`/leaderboard/`);
    return response.data;
  },
};

const UserContext = createContext<UserContextType>({
  user: null,
  userId: 0,
  isLoading: false,
  error: null,
  chats: null,
  messages: [],
  setMessages: () => {},
  setChats: () => {},
  notifications: [],
  notificationCount: 0,
  fetchCurrentUserDetails: async () => {},
  setOnlineStatus: async () => {},
  fetchNotifications: async () => {},
  setNotifications: () => {},
  setNotificationCount: () => {},
  PlayerMatches: null,
  PlayerLeaderBoard: null,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [players, setPlayers] = useState<User[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [PlayerMatches, setPlayerMatches] = useState<History[] | null>(null);
  const [PlayerLeaderBoard, setPlayerLeaderBoard] = useState<LeaderBoard[] | null>(null);
  const [chats, setChats] = useState<Chat[] | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  
  const setOnlineStatus = async () => {
    try {
      const ws = onlineService.createWebSocketConnection();
    } catch (err) {
      console.log('err');
    }
  };

  const fetchCurrentUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await userService.getUserProfile();
      setUser(userData);
      setUserId(userData.id);
      console.log('userData fetched :', userData.display_name);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch current user'));
      setUser(null);
      setUserId(0);
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
      console.log('Failed to fetch chats or user details', error);
    }
  };

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await FriendServices.getPlayers();
      if (data.message) {
        setPlayers(data.data);
        setIsLoading(false);
        return data.data;
      } else if (data.error) {
        console.error(data.error);
        setPlayers(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user details'));
      setPlayers(null);
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
      const fetchPlayerLeaderBoard = await userService.getPlayerLeaderBoard();
      setPlayerLeaderBoard(fetchPlayerLeaderBoard);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch player leaderBoard'));
      setPlayerLeaderBoard(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await notificationsService.getNotifications();
      setNotifications(fetchedNotifications as Notification[]);
      setNotificationCount(fetchedNotifications.length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'));
      setNotifications([]);
      setNotificationCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
    fetchNotifications();
    fetchChats();
    fetchPlayerMatches();
    fetchPlayerLeaderBoard();
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        isLoading,
        players,
        notifications,
        notificationCount,
        chats,
        messages,
        setMessages,
        setChats,
        fetchPlayerMatches,
        fetchPlayerLeaderBoard,
        error,
        setOnlineStatus,
        fetchCurrentUserDetails,
        fetchNotifications,
        fetchChats,
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

export { userApi, userService };
