import { OnlineGameManager } from './pixi';

class SocketManager {
  socket: WebSocket;
  pixiManager: OnlineGameManager;
  sendData: any;

  constructor(url: string, onlinegameanager: OnlineGameManager) {
    this.socket = new WebSocket(url);
    this.pixiManager = onlinegameanager;

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

  //format of socket sending messages:
  // {
  //   type: 'ready' | 'handleInput',
  //   data: any,
  // }

  // data format for 'ready' message:
  // {
  //   gameId: string,
  // }

  // data format for 'handleInput' message:
  // {
  //   gameId: string,
  //   x: number,
  //   }

  //format of socket recieving messages:
  // {
  //   type: 'acknowledgeOpponent' | 'gameUpdate' | 'scoreUpdate' | 'gameState',
  //   data: any,
  // }

  // data format for 'acknowledgeOpponent' message:
  // {
  //   gameId: string,
  //   opponent: {
  //     id: string,
  //     username: string,
  //   },

  // data format for 'gameUpdate' message:
  // {
  //   ballposition: {
  //     x: number,
  //     y: number,
  //   },
  //   topRacket: {
  //     x: number,
  //   },
  //   }

  // data format for 'scoreUpdate' message:
  // {
  //   score: {
  //    player1: number,
  //   player2: number,
  // },

  handleSocketMessage(data: any) {
    switch (data.type) {
      case 'acknowledgeOpponent':
      //saving game id and opponent data in the gamne context
      case 'gameUpdate':
        this.pixiManager.updateGameState(data);
        break;
      case 'scoreUpdate':
        this.pixiManager.updateScores(data);
        break;
      case 'gameState':
        this.pixiManager.handleGameState(data);
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
