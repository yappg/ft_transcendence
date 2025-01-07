export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Notification {
  id: number;
  user: User;
  message: string;
  timestamp: string;
  read: boolean;
}
