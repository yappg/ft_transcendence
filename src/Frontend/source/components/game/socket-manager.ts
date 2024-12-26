import { OnlineGameManager } from './pixi';

class SocketManager extends WebSocket {
  // socket: WebSocket;
  pixiManager!: OnlineGameManager;

  constructor(url: string) {
    super(url);

    this.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleSocketMessage(data);
    };

    this.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
  }

  setPixiManager(manager: OnlineGameManager) {
    this.pixiManager = manager;
  }

  sendData(data: any) {
    this.send(JSON.stringify({ data }));
  }
  
  handleSocketMessage(data: any) {
    switch (data.type) {
      case 'acknowledgeOpponent':
        this.pixiManager.game.gameId = data.gameId;
        this.pixiManager.game.opponent = data.opponent;
        this.pixiManager.game.setGameId(data.gameId);
        this.pixiManager.game.setOpponent(data.opponent);
      case 'gameUpdate':
        this.pixiManager.updateToppaddlePosition(data);
        this.pixiManager.updateBallPosition(data);
        break;
      case 'scoreUpdate':
        this.pixiManager.updateScore(data);
        break;
      case 'gameState':
        this.pixiManager.game.gameState = data.state;
        this.pixiManager.game.setGameState(data.state);
        break;
      default:
        break;
    }
  }

  close() {
    this.close();
  }
}

export default SocketManager;


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
  //  }

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
  // },

  // data format for 'gameUpdate' message:
  // {
  //   ballposition: {
  //     x: number,
  //     y: number,
  //   },
  //   topRacket: {
  //     x: number,
  //   },
  // }

  // data format for 'scoreUpdate' message:
  // {
  //   score: {
  //    player1: number,
  //   player2: number,
  // },

  // data format for 'gameState' message:
  // {
  //   state: 'start' | 'over' | 'waiting' | 'paused',
  // }
