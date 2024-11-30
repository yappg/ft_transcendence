// services/chatService.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chat, Message, User } from '@/constants/chat';

const CHAT_BASE_URL = 'http://localhost:8080/chat';
const USER_BASE_URL = 'http://localhost:8080/api';

const chatApi = axios.create({
  baseURL: CHAT_BASE_URL,
  withCredentials: true,
});

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

const setAuthToken = (config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

chatApi.interceptors.request.use(setAuthToken, (error) => Promise.reject(error));
userApi.interceptors.request.use(setAuthToken, (error) => Promise.reject(error));

export const chatService = {
  async getChatList(): Promise<Chat[]> {
    const response = await chatApi.get('/list/');
    return response.data;
  },

  async getChatMessages(chatId: number): Promise<Message[]> {
    const response = await chatApi.get(`/${chatId}/messages/`);
    return response.data;
  },

  async createWebSocketConnection(
    chatId: number, 
    onMessage: (message: any) => void
  ): Promise<WebSocket> {
    const userId = Cookies.get('user_id');
    const socketUrl = `ws://localhost:8080/ws/chat/${chatId}/`;
    
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    return socket;
  },

  async sendMessage(chatId: number, content: string): Promise<void> {
    const userId = Cookies.get('user_id');
    
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/${chatId}/`);
    
    return new Promise((resolve, reject) => {
      socket.onopen = () => {
        socket.send(JSON.stringify({
          content: content,
          sender: userId,
        }));
        socket.close();
        resolve();
      };

      socket.onerror = (error) => {
        reject(error);
      };
    });
  },

  async getUserDetails(userId: number): Promise<User> {
    const response = await userApi.get(`/users/${userId}`);
    return response.data;
  }
};