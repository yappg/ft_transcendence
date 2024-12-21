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

export interface Chat {
  id: number;
  senders: User[];
  last_message?: Message;
}


