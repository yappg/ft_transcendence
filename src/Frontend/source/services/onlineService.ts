class OnlineService {
  private socket: WebSocket | undefined;

  async createWebSocketConnection(): Promise<WebSocket> {
    try {
      this.closeConnection();

      this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/online/`);

      this.socket.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      this.socket.onclose = (event) => {
        console.log("Disconnected from WebSocket server:", event);
      };

      this.socket.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      this.socket.onmessage = (event) => {
        try {
        } catch (error) {
          console.log("Failed to parse WebSocket message:", error);
        }
      };

      return this.socket;
    } catch (error) {
      console.log("Failed to create WebSocket connection:", error);
      throw error;
    }
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }
}

export const onlineService = new OnlineService();
