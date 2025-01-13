class OnlineService {
  private socket: WebSocket | undefined;

  async createWebSocketConnection(): Promise<WebSocket> {
    try {
      this.closeConnection();

      this.socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/online/`);

      this.socket.onopen = () => {
      };

      this.socket.onclose = (event) => {
      };

      this.socket.onerror = (error) => {
      };

      this.socket.onmessage = (event) => {
        try {
        } catch (error) {
          console.log("Failed to parse WebSocket message:");
        }
      };

      return this.socket;
    } catch (error) {
      console.log("Failed to create WebSocket connection:");
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
