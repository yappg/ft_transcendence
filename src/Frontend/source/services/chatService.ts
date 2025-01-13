import axios from "@/lib/axios";
import { Chat, Message } from "@/constants/chat";

class ChatService {
  private sockets: Map<number, WebSocket> = new Map();

  async getChatList(): Promise<Chat[]> {
    const response = await axios.get("/chat/list/");
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
    setChats: (chats: Chat[]) => void,
  ): Promise<WebSocket> {
    if (this.sockets.has(chatId)) {
      return this.sockets.get(chatId)!;
    }

    const socketUrl = `${process.env.NEXT_PUBLIC_WS_URL}/chat/${chatId}/`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {};

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "user_blocked") {
          const chats = await chatService.getChatList();
          setChats(chats);
        } else {
          onMessage(data);
        }
      } catch (error) {}
    };

    socket.onerror = (error) => {};

    socket.onclose = (event) => {
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
    receiverId: number,
  ): Promise<void> {
    const socket = this.sockets.get(chatId);
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket connection is not open");
    }

    try {
      socket.send(
        JSON.stringify({
          content: content,
          sender: userId,
          receiver: receiverId,
          chatId: chatId,
        }),
      );
    } catch (error) {
      throw new Error("Failed to send message");
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
