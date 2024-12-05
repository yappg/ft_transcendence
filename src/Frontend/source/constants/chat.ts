export interface User {
  id: number;
  username: string;
  profile_picture?: string;
}

export interface Message {
  id?: number;
  chat: number;
  sender: User;
  content: string;
  timestamp?: string;
}

export interface Chat {
  id: number;
  senders: User[];
  last_message?: Message;
}


