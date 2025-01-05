import axios from '@/lib/axios';
import { Notification } from '@/constants/notifications';

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    const response = await axios.get('/relations/notifications/');
    return response.data;
  }
}

export const notificationsService = new NotificationsService();
