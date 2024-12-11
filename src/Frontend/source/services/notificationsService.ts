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

  async getNotifications(): Promise<Notification[]> {
    const response = await notificationsApi.get('/notifications/');
    return response.data;
  }

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/users/me/`);
    return response.data;
  }
}

export const notificationsService = new NotificationsService();