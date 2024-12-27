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
      const message = JSON.parse(event.data);
      this.handleSocketMessage(message);
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
  
  async handleSocketMessage(message: any) {
    switch (message.type) {
      case 'acknowledgeOpponent':
        this.pixiManager.game.gameId = message.data.game_id;
        this.pixiManager.game.opponent = message.data.opponent;
        this.pixiManager.game.setGameId(message.data.gameId);
        this.pixiManager.game.setOpponent(message.data.opponent);
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.send(JSON.stringify({action: "ready", game_id: message.data.game_id}))
      case 'gameUpdate':
        this.pixiManager.updateToppaddlePosition(message.opponent_paddle);
        this.pixiManager.updateBallPosition(message.ball);
        break;
      case 'scoreUpdate':
        this.pixiManager.updateScore(message);
        break;
      case 'gameState':
        this.pixiManager.game.gameState = message.state;
        this.pixiManager.game.setGameState(message.state);
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
