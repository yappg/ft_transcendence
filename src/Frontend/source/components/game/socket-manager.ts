/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import { OnlineGameManager } from "./pixi-manager";
import { Player } from "@/context/GameContext";

class SocketManager {
  socket: WebSocket;
  pixiManager!: OnlineGameManager;
  game_id: string;
  constructor(url: string, game_id: string) {
    let newUrl = url;
    if (game_id && game_id !== "") {
      newUrl = url + "?game_id=" + game_id;
    }
    this.game_id = game_id;
    this.socket = new WebSocket(newUrl);
    this.socket.onopen = () => {};

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleSocketMessage(message);
    };

    this.socket.onclose = () => {};

    this.socket.onerror = (error) => {};
  }

  setPixiManager(manager: OnlineGameManager) {
    this.pixiManager = manager;
  }

  sendData(data: any) {
    this.socket.send(JSON.stringify(data));
  }

  updateBallPosition(data: any) {
    if (data) {
      const scale_x = this.pixiManager.screenWidth / 75;
      const scale_y = this.pixiManager.screenHeight / 100;

      const new_x = scale_x * data.position.x;
      const new_y = scale_y * data.position.y;

      if (this.pixiManager.isTopPaddle) {
        this.pixiManager.ball.x = this.pixiManager.screenWidth - new_x;
        this.pixiManager.ball.y = this.pixiManager.screenHeight - new_y;
        this.pixiManager.dx = -data.dx;
        this.pixiManager.dy = -data.dy;
      }
      if (!this.pixiManager.isTopPaddle) {
        this.pixiManager.ball.x = new_x;
        this.pixiManager.ball.y = new_y;
        this.pixiManager.dx = data.dx;
        this.pixiManager.dy = data.dy;
      }
    }
  }

  updatePaddlePosition(data: any) {
    if (data) {
      const scale_x = this.pixiManager.screenWidth / 75;

      const new_x = scale_x * data.new_x;

      if (this.pixiManager.isTopPaddle) {
        this.pixiManager.topRacket.x =
          this.pixiManager.screenWidth - (new_x + this.pixiManager.paddleWidth);
      } else {
        this.pixiManager.topRacket.x = new_x;
      }
    }
  }

  async handleSocketMessage(message: any) {
    switch (message.type) {
      case "acknowledgeOpponent":
        this.pixiManager.game.gameId = message.data.game_id;
        this.pixiManager.game.opponent = {
          username: message.data.opponent,
          avatar: message.data.opponent_avatar,
        } as Player;
        this.pixiManager.isTopPaddle = !message.data.top_paddle;
        this.pixiManager.game.setGameId(message.data.gameId);
        this.pixiManager.game.setOpponent({
          username: message.data.opponent,
          avatar: message.data.opponent_avatar,
        } as Player);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.sendData({
          action: "ready",
          game_id: message.data.game_id,
          map: this.pixiManager.map,
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
        if (this.pixiManager.isTopPaddle) {
          score1 = message.data.top[message.data.round];
          score2 = message.data.bottom[message.data.round];
        } else {
          score1 = message.data.bottom[message.data.round];
          score2 = message.data.top[message.data.round];
        }
        this.pixiManager.game.setGameScore([score1, score2]);
        this.pixiManager.game.GameScore = [score1, score2];
      case "gameState":
        this.pixiManager.game.GameState = message.state;
        this.pixiManager.game.setGameState(message.state);
        if (message.state === "over") {
          this.pixiManager.game.setOnlineGameWinner(message.winner);
          this.pixiManager.game.onlineGameWinner = message.winner;
        }
        break;
      case "AlreadyInQorG":
        this.close();
        window.location.href = "/home";
        break;
      case "GameDisconnect":
        this.pixiManager.game.GameState = "over";
        this.pixiManager.game.setGameState("over");
        this.close();
        break;
      default:
        break;
    }
  }

  close() {
    this.socket.close(1000);
  }
}

export default SocketManager;
