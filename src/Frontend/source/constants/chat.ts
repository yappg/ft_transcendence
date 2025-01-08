export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id?: number;
  chat: number;
  sender: string;
  receiver: string;
  content: string;
  send_at?: string;
}

export interface LastMessage {
  content: string;
  id: number;
  send_at: string;
}
export interface ReceiverData {
  avatar: string;
  id: number;
  username: string;
  usernameGame: string;
}
export interface Chat {
  created_at: string;
  id: number;
  last_message?: LastMessage;
  receiver: ReceiverData;
  is_blocked: boolean;
  blocked_by: boolean;
  is_online: boolean;
  send_at: string;
}
