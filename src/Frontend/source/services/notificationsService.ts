import axios from "@/lib/axios";
import { Notification } from "@/constants/notifications";

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await axios.get("/relations/notifications/");
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await axios.post("/relations/notifications/");
    } catch (error) {}
  }
}

export const notificationsService = new NotificationsService();
