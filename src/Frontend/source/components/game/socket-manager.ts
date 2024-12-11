import PixiManager from './pixi-manager';

class SocketManager {
  socket: WebSocket;
  pixiManager: PixiManager;

  constructor(url: string, pixiManager: PixiManager) {
    this.socket = new WebSocket(url);
    this.pixiManager = pixiManager;

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleSocketMessage(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
  }

  handleSocketMessage(data: any) {
    switch (data.type) {
      case 'gameUpdate':
        this.pixiManager.updateGameState(data);
        break;
      case 'scoreUpdate':
        this.pixiManager.updateScores(data);
        break;
      case 'gameEvent':
        this.pixiManager.handleGameEvent(data);
        break;
      default:
        break;
    }
  }

  close() {
    this.socket.close();
  }
}

export default SocketManager;