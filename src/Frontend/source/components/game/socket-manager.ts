/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import { User } from "@/context/GlobalContext";
import { OnlineGameManager } from "./pixi-manager";
import { GameContextType, Player } from "@/context/GameContext";

class SocketManager extends WebSocket {
  // pixiManager!: OnlineGameManager;
  game: GameContextType;
  game_id: string;
  constructor(url: string, game_id: string, game: GameContextType) {
    let newUrl = url;
    super(newUrl);
    if (game_id && game_id !== "") {
      newUrl = url + "?game_id=" + game_id;
    }
    this.game = game;
    this.game_id = game_id;

    this.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);
      this.handleSocketMessage(message);
    };

    this.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  }

  setPixiManager(manager: OnlineGameManager) {
    this.game.pixiManager = manager;
  }

  sendData(data: any) {
    this.send(JSON.stringify(data));
  }

  updateBallPosition(data: any) {
    if (data) {
      const pixiManager = this.game.pixiManager;
      if (!pixiManager) return;
      const scale_x = pixiManager.screenWidth / 75;
      const scale_y = pixiManager.screenHeight / 100;

          const new_x = scale_x * data.position.x;
          const new_y = scale_y * data.position.y;
    
          if (pixiManager.isTopPaddle) {
            pixiManager.ball.x = pixiManager.screenWidth - new_x;
            pixiManager.ball.y = pixiManager.screenHeight - new_y;
            pixiManager.dx = -data.dx;
            pixiManager.dy = -data.dy;
          }
          if (!pixiManager.isTopPaddle) {
        pixiManager.ball.x = new_x;
        pixiManager.ball.y = new_y;
        pixiManager.dx = data.dx;
        pixiManager.dy = data.dy;
      }
    }
  }

  updatePaddlePosition(data: any) {
    if (data && this.game.pixiManager) {
      const scale_x = this.game.pixiManager.screenWidth / 75;

      const new_x = scale_x * data.new_x;

      if (this.game.pixiManager.isTopPaddle) {
        this.game.pixiManager.topRacket.x =
          this.game.pixiManager.screenWidth - (new_x + this.game.pixiManager.paddleWidth);
      } else {
        this.game.pixiManager.topRacket.x = new_x;
      }
    }
  }

  async handleSocketMessage(message: any) {
    console.log("message:", message);
    switch (message.type) {
      case "acknowledgeOpponent":
        this.game.setGameId(message.data.game_id);
        this.game.setOpponent({
          username: message.data.opponent,
          avatar: message.data.opponent_avatar,
        } as User);
        const pixiManager = this.game.pixiManager;
        if (pixiManager) {
          pixiManager.isTopPaddle = !message.data.top_paddle;
        }
        this.game.setGameId(message.data.gameId);
        this.game.setOpponent({
          username: message.data.opponent,
          avatar: message.data.opponent_avatar,
        } as User);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.sendData({
          action: "ready",
          game_id: message.data.game_id,
          game: this.game.pixiManager?.map,
        });
      case "UpdateBall":
        this.updateBallPosition(message.ball_position);
        break;
      case "UpdatePaddle":
        this.updatePaddlePosition(message);
        break;
      case "UpdateScore":
        let score1 = 0;
        let score2 = 0;
        console.log("message:", message);
        if (this.game.pixiManager?.isTopPaddle) {
          score1 = message.data.top[message.data.round];
          score2 = message.data.bottom[message.data.round];
        } else {
          score1 = message.data.bottom[message.data.round];
          score2 = message.data.top[message.data.round];
        }
        this.game.setGameScore([score1, score2]);
      case "gameState":
        this.game.setGameState(message.state);
        break;
      case "GameEnd":
        this.game.setGameState("over");
        this.game.setGameWinner(message.winner);
        this.close();
        break;
      default:
        break;
    }
  }

  close() {
    super.close();
  }
}

export default SocketManager;
