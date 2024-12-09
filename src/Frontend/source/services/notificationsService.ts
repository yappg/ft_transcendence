import axios from 'axios';
import { Notification, User } from '@/constants/notifications';

const NOTIFICATIONS_BASE_URL = 'http://localhost:8080/relations/';
const USER_BASE_URL = 'http://localhost:8080/api';

const notificationsApi = axios.create({
  baseURL: NOTIFICATIONS_BASE_URL,
  withCredentials: true,
});

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

class NotificationsService {
  private socket: WebSocket | null = null;

  async getNotifications(): Promise<Notification[]> {
    const response = await notificationsApi.get('/notifications/');
    return response.data;
  }

  async createWebSocketConnection(
    userId: number,
    onMessage: (notification: Notification) => void
  ): Promise<WebSocket> {
    if (this.socket) {
      console.log('WebSocket connection already exists');
      return this.socket;
    }

    const socketUrl = `ws://localhost:8080/ws/notifications/${userId}/`;
    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
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
    };

    return this.socket;
  }

  // async markAsRead(notificationId: number): Promise<void> {
  //   try {
  //     await notificationsApi.post(`/mark-as-read/${notificationId}`);
  //   } catch (error) {
  //     console.error('Error marking notification as read:', error);
  //     throw new Error('Failed to mark notification as read');
  //   }
  // }

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/users/me/`);
    return response.data;
  }
}

export const notificationsService = new NotificationsService();