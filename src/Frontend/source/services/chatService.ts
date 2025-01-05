import axios from '@/lib/axios';
import { Chat, Message } from '@/constants/chat';

class ChatService {
  private sockets: Map<number, WebSocket> = new Map();
  
  async getChatList(): Promise<Chat[]> {
    const response = await axios.get('/chat/list/');
    return response.data;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    const response = await axios.get(`/chat/${chatId}/messages/`);
    return response.data;
  }

  // ------------------------------------------------------------------------

  async createWebSocketConnection(
    chatId: number,
    onMessage: (message: any) => void,
    setChats: (chats: Chat[]) => void
  ): Promise<WebSocket> {
    if (this.sockets.has(chatId)) {
      console.log('WebSocket connection already exists for chatId:', chatId);
      return this.sockets.get(chatId)!;
    }

    const socketUrl = `ws://localhost:8080/ws/chat/${chatId}/`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connection established for chatId:', chatId);
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'user_blocked') {
          const chats = await chatService.getChatList();
          setChats(chats);
        } else {
          onMessage(data);
        }
      } catch (error) {
        console.log('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.sockets.delete(chatId);
    };

    this.sockets.set(chatId, socket);
    return socket;
  }

  // --------------------------------------------------------------------------

  async sendMessage(
    chatId: number,
    content: string,
    userId: number,
    receiverId: number
  ): Promise<void> {
    console.log('chatService.sendMessage called');
    const socket = this.sockets.get(chatId);
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection is not open');
    }

    try {
      socket.send(
        JSON.stringify({
          content: content,
          sender: userId,
          receiver: receiverId,
          chatId: chatId,
        })
      );
    } catch (error) {
      console.log('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // ------------------------------------------------

  closeAllConnections(): void {
    this.sockets.forEach((socket, chatId) => {
      socket.close();
      this.sockets.delete(chatId);
    });
  }
}

export const chatService = new ChatService();
