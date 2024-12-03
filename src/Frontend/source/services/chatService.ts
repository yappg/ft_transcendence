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

class ChatService {
  private socket: WebSocket | null = null;
  // private currentUserId: number | null = null;

  async getChatList(): Promise<Chat[]> {
    const response = await chatApi.get('/list/');
    return response.data;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    const response = await chatApi.get(`/${chatId}/messages/`);
    return response.data;
  }

  async createWebSocketConnection(
    chatId: number, 
    onMessage: (message: any) => void
  ): Promise<WebSocket> {
    if (this.socket) {
      console.log('WebSocket connection already exists');
      return this.socket;
    }

    const socketUrl = `ws://localhost:8080/ws/chat/${chatId}/`;
    this.socket = new WebSocket(socketUrl);
    // const currenttemp = await this.getCurrentUserId;
    // this.currentUserId = currenttemp.id;

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // if (data.sender !== this.currentUserId) {check after/
          onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.socket = null;
    };

    return this.socket;
  }

  async sendMessage(chatId: number, content: string, userId: number): Promise<void> {
    console.log('chatService.sendMessage called'); // Debug log
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection is not open');
    }
    
    try {
      this.socket.send(JSON.stringify({
        content: content,
        sender: userId,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async getUserDetails(userId: number): Promise<User> {
    const response = await userApi.get(`/users/${userId}`);
    return response.data;
  }

  async getUserDetailsByUsername(username: string): Promise<User> {
    const response = await userApi.get(`/users/${username}`);
    return response.data;
  }

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/users/me/`);
    return response.data;
  }

}

export const chatService = new ChatService();
