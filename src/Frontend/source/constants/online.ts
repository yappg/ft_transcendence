export interface OnlineStatus {
  is_online: boolean;
  last_login?: string;
  user_id: number;
}

export interface WebSocketMessage {
  type: string;
  data: OnlineStatus;
}
