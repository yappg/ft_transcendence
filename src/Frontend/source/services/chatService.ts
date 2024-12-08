import axios from 'axios';
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

class ChatService {
  private socket: WebSocket | null = null;
  private currentChatId: number | null = null;

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
    if (this.socket && this.currentChatId === chatId) {
      console.log('WebSocket connection already exists for chatId:', chatId);
      return this.socket;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.currentChatId = null;
    }

    const socketUrl = `ws://localhost:8080/ws/chat/${chatId}/`;
    this.socket = new WebSocket(socketUrl);
    this.currentChatId = chatId;

    this.socket.onopen = () => {
      console.log('WebSocket connection established for chatId:', chatId);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
      this.currentChatId = null;
    };

    return this.socket;
  }

  async sendMessage(chatId: number, content: string, userId: number, receiverId: number): Promise<void> {
    console.log('chatService.sendMessage called'); // Debug log
    if (!this.socket ){
      throw new Error('WebSocket connection is not open');
    }
    console.log('are you here-------<<<')
    try {
      this.socket.send(JSON.stringify({
        content: content,
        sender: userId,
        receiver: receiverId,
        chatId: chatId,
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
