import * as PIXI from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { Assets, Sprite, Graphics } from "pixi.js";
import SocketManager from "./socket-manager";
import { User } from "@/context/GlobalContext";
import socketManager from "./socket-manager";
// import { basename } from "path";
// import { Scale } from "lucide-react";

// Global Game Manager

export abstract class PixiManager {
  app: PIXI.Application;
  topRacket!: PIXI.Graphics;
  bottomRacket!: PIXI.Graphics;
  ball!: PIXI.Graphics;
  backgroundImage: string;
  keysPressed: Set<string> = new Set("");
  paddleWidth: number;
  paddleheight!: number;
  ballRatio!: number;
  gameState: string = "waiting";
  screenWidth: number = 0;
  screenHeight: number = 0;
  ballMovementSpeed: number = 0;
  waitingText!: PIXI.Text;
  game: any;
  map: string;
  isTopPaddle: boolean = false;
  round: number;
  dx = 0;
  dy = 1;

constructor(container: HTMLElement, map: string, game: any) {
    this.app = new PIXI.Application();
    this.backgroundImage = `/${map}.png`;
    this.paddleWidth = 0;
    this.game = game;
    this.map = map;
    this.round = 0;
    this.game.GameState = 'waiting';
    this.initWindow(container).then(() => {});
  }

  async initWindow(container: HTMLElement) {
    await this.app.init({
      background: "#000000",
      resizeTo: document.getElementById("table") as
        | HTMLElement
        | Window
        | undefined,
    });
    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;
    container.appendChild(this.app.canvas);
    const backgroundTexture = await Assets.load(this.backgroundImage);
    const background = new Sprite(backgroundTexture);
    background.width = this.screenWidth;
    background.height = this.screenHeight;
    this.paddleWidth = this.screenWidth / 5;
    this.paddleheight = this.screenHeight / 40;
    this.ballRatio = this.screenWidth / 35;
    background.alpha = 0.2;
    this.app.stage.addChild(background);
    this.drawGameElements();
  }

  drawGameElements() {
    this.topRacket = this.createRacket(
      this.screenWidth / 2 - this.paddleWidth / 2,
      20,
      this.paddleWidth,
      this.paddleheight,
      0xff0000,
      0x000000,
    );
    this.bottomRacket = this.createRacket(
      this.screenWidth / 2 - this.paddleWidth / 2,
      this.screenHeight - 20 - this.paddleheight,
      this.paddleWidth,
      this.paddleheight,
      0x00ffff,
      0x000000,
    );

    this.ball = this.createBall(0, 0, this.screenWidth / 35, 0xff0000);

    this.app.stage.addChild(this.topRacket);
    this.app.stage.addChild(this.bottomRacket);
    this.app.ticker.add(() => {
      this.handleGameStates();
    });
  }

  abstract handleGameStates(): void;
  abstract handlegameupdates(): void;
  abstract handleWaitingState(): void;

  createBall(x: number, y: number, radius: number, color: number) {
    const ball = new Graphics();
    ball.circle(x, y, radius);
    ball.fill({ color });
    ball.x = this.screenWidth / 2;
    ball.y = this.screenHeight / 2;
    return ball;
  }

  createRacket(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    glowColor: number,
  ) {
    const racket = new Graphics();

    racket.fill({ color });
    racket.roundRect(0, 0, width, height, 10);
    racket.fill();

    racket.position.set(x, y);

    const glowFilter = new GlowFilter({
      distance: 15,
      outerStrength: 3,
      innerStrength: 3,
      color: glowColor,
      quality: 1,
    });
    racket.filters = [glowFilter];

    return racket;
  }

  displayText( text: string ) {
    if (!this.app.stage.children.includes(this.waitingText)) {
      const style = new PIXI.TextStyle({
        fontFamily: "Days One",
        fontSize: 64,
        fill: "#ff0000",
        align: "center",
      });

      this.waitingText = new PIXI.Text({ text: text, style: style });

      this.waitingText.anchor.set(0.5);
      this.waitingText.x = this.screenWidth / 2;
      this.waitingText.y = this.screenHeight / 2;

      this.app.stage.addChild(this.waitingText);
    }
  }

  removeGameElements() {
    this.app.stage.removeChild(this.topRacket);
    this.app.stage.removeChild(this.bottomRacket);
    this.app.stage.removeChild(this.ball);
    this.app.stage.removeChild(this.waitingText);
  }

  updatePaddlePosition(isMyPaddle: boolean, position: number): void {
    if (isMyPaddle) {
      this.bottomRacket.x = position;
    } else {
      this.topRacket.x = position;
    }
  }

  updateBallPosition(x: number, y: number): void {
    // console.log('updateBallPosition', x, y, this.screenHeight, this.screenWidth);
    this.ball.x = x;
    this.ball.y = y;
  }

  handleKeyDown(event: KeyboardEvent) {
    this.keysPressed.add(event.key);
    console.log(`Key down: ${event.key}`);
    console.log(`Keys pressed: ${Array.from(this.keysPressed).join(", ")}`);
  }

  handleKeyUp(event: KeyboardEvent) {
    this.keysPressed.delete(event.key);
    console.log(`Key up: ${event.key}`);
    console.log(`Keys pressed: ${Array.from(this.keysPressed).join(", ")}`);
  }
}

// Local Game Manager
export class LocalGameManager extends PixiManager {
  async handlegameupdates() {
    if (!this.ball || !this.app) return;

    const baseSpeed = 1;
    const baseScreenDiagonal = Math.sqrt(75 ** 2 + 100 ** 2);
    const currentScreenDiagonal = Math.sqrt(
      this.screenWidth ** 2 + this.screenHeight ** 2,
    );

    this.ballMovementSpeed =
      (currentScreenDiagonal / baseScreenDiagonal) * baseSpeed;

    this.updateBallPosition(this.ball.x + this.dx * this.ballMovementSpeed, this.ball.y + this.dy * this.ballMovementSpeed);

    if (this.ball.x <= 0 || this.ball.x >= this.screenWidth) {
      this.dx *= -1;
    }

    if (
      this.ball.y + this.ballRatio + this.paddleheight >= this.topRacket.y &&
      this.ball.y <= this.topRacket.y + this.topRacket.height &&
      this.ball.x >= this.topRacket.x &&
      this.ball.x <= this.topRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;

      const collisionPoint = this.ball.x - this.topRacket.x;
      const normalizedCollisionPoint = (collisionPoint - this.paddleWidth / 2) / (this.paddleWidth / 2);
    
      this.dx = normalizedCollisionPoint * (Math.abs(this.dx) + 0.5);
    }

    if (
      this.ball.y + this.ballRatio >= this.bottomRacket.y &&
      this.ball.y <= this.bottomRacket.y + this.bottomRacket.height &&
      this.ball.x >= this.bottomRacket.x &&
      this.ball.x <= this.bottomRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;
      const collisionPoint = this.ball.x - this.bottomRacket.x;
      const normalizedCollisionPoint = (collisionPoint - this.paddleWidth / 2) / (this.paddleWidth / 2);

      this.dx = normalizedCollisionPoint * (Math.abs(this.dx) + 0.5);
    }
    if (this.ball.y <= 0 || this.ball.y >= this.screenHeight) {
      const score1 = this.game.GameScore[0];
      const score2 = this.game.GameScore[1];
      this.dx = 0;
      this.topRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
      this.bottomRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
      if (this.ball.y <= 0) {
        this.game.setGameScore([score1 + 1, score2]);
        this.game.GameScore[0] += 1;
        this.game.setTotalScore([this.game.totalScore[0] + 1, this.game.totalScore[1]]);
        this.game.totalScore[0] += 1;
      } else {
        this.game.setGameScore([score1, score2 + 1]);
        this.game.GameScore[1] += 1;
        this.game.setTotalScore([this.game.totalScore[0], this.game.totalScore[1] + 1]);
        this.game.totalScore[1] += 1;
      }
      this.dy = (this.game.GameScore[0] + this.game.GameScore[1]) % 2 == 1? 1 : -1;
      if (this.game.GameScore[0] > 6 || this.game.GameScore[1] > 6) {
        this.game.GameScore = [0, 0];
        this.app.stage.removeChild(this.ball);
        this.ball.x = this.screenWidth / 2;
        this.ball.y = this.screenHeight / 2;
        this.round += 1;
        if (this.round < 3) {
          this.game.GameState = 'waiting';
          this.game.setGameState('waiting');
        }
        else {
          this.game.GameState = 'over';
          this.game.setGameState('over');
          const sleepmoment = new Promise((resolve) => setTimeout(resolve, 4000));
          await sleepmoment;
          this.game.setInGame(false);
          this.game.setTournamentMatch(this.game.tournamentMatch + 1);
        }
      }
      this.ball.x = this.screenWidth / 2;
      this.ball.y = this.screenHeight / 2;
      const sleepmoment = new Promise((resolve) => setTimeout(resolve, 10000));
      await sleepmoment;
    }
  }

  handleWaitingState(): void {
    const sleepmoment = new Promise((resolve) => setTimeout(resolve, 10000));
    sleepmoment.then(() => {
      this.app.stage.removeChild(this.waitingText);
      this.app.stage.addChild(this.ball);
      this.game.GameState = "start";
      this.game.setGameState("start");
    });
  }

  handlepaddlesMouvements() {
    const bottomRacket = this.bottomRacket;
    const app = this.app;

    if (!bottomRacket || !app) return;

    const baseScreenWidth = 75;
    const movementSpeed = (this.screenWidth / baseScreenWidth) * 0.5;

    if (
      this.keysPressed.has("ArrowLeft") &&
      !this.keysPressed.has("ArrowRight")
    ) {
      bottomRacket.x = Math.max(0, bottomRacket.x - movementSpeed);
    }

    if (
      this.keysPressed.has("ArrowRight") &&
      !this.keysPressed.has("ArrowLeft")
    ) {
      bottomRacket.x = Math.min(
        this.screenWidth - bottomRacket.width,
        bottomRacket.x + movementSpeed,
      );
    }

    if (
      (this.keysPressed.has("a") || this.keysPressed.has("A")) &&
      !this.keysPressed.has("d") &&
      !this.keysPressed.has("D")
    ) {
      this.topRacket.x = Math.max(0, this.topRacket.x - movementSpeed);
    }

    if (
      (this.keysPressed.has("d") || this.keysPressed.has("D")) &&
      !this.keysPressed.has("a") &&
      !this.keysPressed.has("A")
    ) {
      this.topRacket.x = Math.min(
        this.screenWidth - this.topRacket.width,
        this.topRacket.x + movementSpeed,
      );
    }
  }

  handleGameStates(): void {
    if (this.game.GameState === "waiting") {
      this.displayText("Get\nReady");
      this.handleWaitingState();
    }
    if (this.game.GameState === "start") {
      this.handlegameupdates();
      this.handlepaddlesMouvements();
    }
    if (this.game.GameState === "over") {
      this.removeGameElements();
      this.displayText("Game\nOver");
    }
  }
}

// Online Game Managerƒ

export class OnlineGameManager extends PixiManager {
  socketManager: SocketManager;
  user: User | null;
  game_id: string;
  constructor(
    container: HTMLElement,
    backgroundImage: string,
    game: any,
    user: User | null,
    game_id: string
  ) {
    super(container, backgroundImage, game);
    this.socketManager = new socketManager(`${process.env.NEXT_PUBLIC_WS_URL}/game/`, game_id);
    this.game_id = game_id;
    this.user = user;
    this.socketManager.setPixiManager(this);
  }

  moveMyPaddle() {
    const bottomRacket = this.bottomRacket;
    const app = this.app;

    const baseScreenWidth = 75;
    const scale_x = baseScreenWidth / this.screenWidth;

    if (!bottomRacket || !app) return;

    const movementSpeed = (this.screenWidth / baseScreenWidth) * 0.5;

    if (
      this.keysPressed.has("ArrowLeft") &&
      !this.keysPressed.has("ArrowRight")
    ) {
      bottomRacket.x = Math.max(0, bottomRacket.x - movementSpeed);
      if (this.isTopPaddle) {
        this.socketManager.sendData({
          action: "move_paddle",
          new_x:
            (this.screenWidth - (bottomRacket.x + this.paddleWidth)) * scale_x,
        });
      } else {
        this.socketManager.sendData({
          action: "move_paddle",
          new_x: bottomRacket.x * scale_x,
        });
      }
    }

    if (
      this.keysPressed.has("ArrowRight") &&
      !this.keysPressed.has("ArrowLeft")
    ) {
      bottomRacket.x = Math.min(
        this.screenWidth - bottomRacket.width,
        bottomRacket.x + movementSpeed,
      );
      if (this.isTopPaddle) {
        console.log(
          "move_paddle Istop",
          this.screenWidth,
          bottomRacket.x,
          this.paddleWidth,
          scale_x,
        );
        this.socketManager.sendData({
          action: "move_paddle",
          new_x:
            (this.screenWidth - (bottomRacket.x + this.paddleWidth)) * scale_x,
        });
      } else {
        console.log(
          "move_paddle NotTp",
          this.screenWidth,
          bottomRacket.x,
          this.paddleWidth,
          scale_x,
        );
        this.socketManager.sendData({
          action: "move_paddle",
          new_x: bottomRacket.x * scale_x,
        });
      }
    }
  }

  handlepaddlesMouvements() {
    this.moveMyPaddle();
  }

  handleGameStates(): void {
    if (this.game.GameState === "waiting") {
      this.handleWaitingState();
    }
    if (this.game.GameState === "start") {
      if (this.app.stage.children.includes(this.waitingText)) {
        this.app.stage.removeChild(this.waitingText);
      }
      if (!this.app.stage.children.includes(this.ball)) {
        this.app.stage.addChild(this.ball);
      }
      // console.log('start event');
      this.handlegameupdates();
      this.handlepaddlesMouvements();
    }
    if (this.game.GameState === "over") {
      this.removeGameElements();
      this.displayText("Game\nOver");
    }
  }

    // updateScore(data: any) {
    //   const score1 = data.self_score[data.round];
    //   const score2 = data.opponent_score[data.round];
    //   this.game.GameScore =  [score1, score2];
    // }
  

  handlegameupdates() {
    if (!this.app) return;
    // console.log(`width: ${this.screenWidth}, height: ${this.screenHeight}`);
    if (!this.ball) this.app.stage.addChild(this.ball);

    const scale_x = this.screenWidth / 75;
    const scale_y = this.screenHeight / 100;

    const frontendDeltaTime = 0.016; // this.app.ticker.FPS; // Calculate frontend delta time
    // console.log('frontendDeltaTime:', frontendDeltaTime);

    this.ball.x = this.ball.x + this.dx * frontendDeltaTime * scale_x; //(frontendDeltaTime/backendDeltaTime);
    this.ball.y = this.ball.y + this.dy * frontendDeltaTime * scale_y; //(frontendDeltaTime/backendDeltaTime);

    this.updateBallPosition(this.ball.x, this.ball.y);
    // if (this.ball.y <= 0 || this.ball.y >= this.screenHeight) {
    //   const score1 = this.game.GameScore[0];
    //   const score2 = this.game.GameScore[1];
    //   this.dx = 0;
    //   this.topRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
    //   this.socketManager.sendData({ action: 'move_paddle', new_x: (this.screenWidth - (this.bottomRacket.x + this.paddleWidth)) * 1 / scale_x });
    //   this.bottomRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
    //   this.socketManager.sendData({ action: 'move_paddle', new_x: (this.screenWidth - (this.bottomRacket.x + this.paddleWidth)) * 1 / scale_x });
    //   if (this.ball.y <= 0) {
    //     this.game.setGameScore([Math.min(score1 + 1, 6), score2]);
    //     this.game.GameScore[0] = Math.min(score1 + 1, 6);
    //   } else {
    //     this.game.setGameScore([score1, Math.min(score2 + 1)]);
    //     this.game.GameScore[1] = Math.min(score1 + 1, 7);
    //     // this.game.GameScore[1] += 1;
    //   }
    //   this.ball.x = this.screenWidth / 2;
    //   this.ball.y = this.screenHeight / 2;
    // }
  }

  handleWaitingState() {
    this.app.stage.removeChild(this.ball);
    this.displayText("Get\nReady");
  }
}
