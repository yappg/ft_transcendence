import { OnlineStatus, WebSocketMessage } from '@/types/online'

class OnlineService {
  private socket: WebSocket | undefined
  // private reconnectAttempts = 0

  async createWebSocketConnection(userId: number): Promise<WebSocket> {
    try {

      this.closeConnection()


      this.socket = new WebSocket(`ws://localhost:8080/ws/online/${userId}`)

      this.socket.onopen = () => {
        console.log('Connected to WebSocket server')
      }

      this.socket.onclose = (event) => {
        console.log('Disconnected from WebSocket server:', event)
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)// change to log
      }

      this.socket.onmessage = (event) => {
        try {
          // console.log('Received message:', event)
        } catch (error) {
          console.log('Failed to parse WebSocket message:', error)
        }
      }

      return this.socket
    } catch (error) {
      console.log('Failed to create WebSocket connection:', error)
      throw error
    }
  }

  closeConnection() {


    if (this.socket) {
      this.socket.close()
      this.socket = undefined
    }
  }
}

export const onlineService = new OnlineService()

