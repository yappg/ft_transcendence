import * as PIXI from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { Assets, Sprite, Graphics } from "pixi.js";
import SocketManager from "./socket-manager";
import { User } from "@/context/GlobalContext";

export abstract class PixiManager {
  app: PIXI.Application;
  topRacket!: PIXI.Graphics;
  bottomRacket!: PIXI.Graphics;
  ball!: PIXI.Graphics;
  backgroundImage: string;
  keysPressed: Set<string> = new Set();
  paddleWidth: number;
  paddleheight!: number;
  ballRatio!: number;
  screenWidth: number = 0;
  screenHeight: number = 0;
  ballMovementSpeed: number = 0;
  waitingText!: PIXI.Text;
  game: any;
  isTopPaddle: boolean = false;
  round = 0;
  dx = 1;
  dy = 1;

  constructor(container: HTMLElement, backgroundImage: string, game: any) {
    this.app = new PIXI.Application();
    this.backgroundImage = backgroundImage;
    this.paddleWidth = 0;
    this.game = game;
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

  abstract updatePaddlePosition(): void;
  abstract updateBallPosition(data?: { x: number; y: number }): void;

  removeGameElements() {
    this.app.stage.removeChild(this.topRacket);
    this.app.stage.removeChild(this.bottomRacket);
    this.app.stage.removeChild(this.ball);
  }

  displayGameOverText() {
    const style = new PIXI.TextStyle({
      fontFamily: "Days One",
      fontSize: 64,
      fill: "#ff0000",
      align: "center",
    });

    const gameOverText = new PIXI.Text({ text: "Game\nOver", style: style });

    gameOverText.anchor.set(0.5);
    gameOverText.x = this.screenWidth / 2;
    gameOverText.y = this.screenHeight / 2;

    this.app.stage.addChild(gameOverText);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.keysPressed.add(event.key);
  }

  handleKeyUp(event: KeyboardEvent) {
    this.keysPressed.delete(event.key);
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
      if (this.game.GameState === "waiting") {
        this.displayWaitingText();
        this.handleWaitingState();
      }
      if (this.game.GameState === "start") {
        this.app.stage.removeChild(this.waitingText);
        this.app.stage.addChild(this.ball);
        if (this.round < 3) {
          this.updateBallPosition();
          this.updatePaddlePosition();
        } else {
          this.game.GameState = "over";
          this.game.setGameState("over");
        }
      }
      if (this.game.GameState === "over") {
        this.removeGameElements();
        this.displayGameOverText();
      }
    });
  }

  displayWaitingText() {
    if (!this.app.stage.children.includes(this.waitingText)) {
      const style = new PIXI.TextStyle({
        fontFamily: "Days One",
        fontSize: 64,
        fill: "#ff0000",
        align: "center",
      });

      this.waitingText = new PIXI.Text({ text: "Waiting", style: style });

      this.waitingText.anchor.set(0.5);
      this.waitingText.x = this.screenWidth / 2;
      this.waitingText.y = this.screenHeight / 2;

      this.app.stage.addChild(this.waitingText);
    }
  }

  abstract handleWaitingState(): Promise<void>;

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
}

export class LocalGameManager extends PixiManager {
  updatePaddlePosition() {
    const bottomRacket = this.bottomRacket;
    const app = this.app;

    if (!bottomRacket || !app) return;

    const baseScreenWidth = 75;
    const movementSpeed = (baseScreenWidth / this.screenWidth) * 15;

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
  updateBallPosition() {
    if (!this.ball || !this.app) return;

    const baseSpeed = 4;

    const baseScreenDiagonal = Math.sqrt(75 ** 2 + 100 ** 2);
    const currentScreenDiagonal = Math.sqrt(
      this.screenWidth ** 2 + this.screenHeight ** 2,
    );

    this.ballMovementSpeed =
      (currentScreenDiagonal / baseScreenDiagonal) * baseSpeed;

    // this.ball.x += this.dx * this.ballMovementSpeed;
    this.ball.y += this.dy * this.ballMovementSpeed;

    if (this.ball.x <= 0 || this.ball.x >= this.screenWidth) {
      this.dx *= -1;
      this.ball.x += this.dx * this.ballMovementSpeed;
    }

    if (
      this.ball.y + this.ballRatio + this.paddleheight >= this.topRacket.y &&
      this.ball.y <= this.topRacket.y + this.topRacket.height &&
      this.ball.x >= this.topRacket.x &&
      this.ball.x <= this.topRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;
      this.ball.y += this.dy * this.ballMovementSpeed;
    }

    if (
      this.ball.y + this.ballRatio >= this.bottomRacket.y &&
      this.ball.y <= this.bottomRacket.y + this.bottomRacket.height &&
      this.ball.x >= this.bottomRacket.x &&
      this.ball.x <= this.bottomRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;
      this.ball.y += this.dy * this.ballMovementSpeed;
    }
    if (this.ball.y <= 0 || this.ball.y >= this.screenHeight) {
      const score1 = this.game.GameScore[0];
      const score2 = this.game.GameScore[1];
      if (this.ball.y <= 0) {
        this.game.setGameScore([score1 + 1, score2]);
        this.game.GameScore[0] += 1;
        this.dy = 1;
      } else {
        this.game.setGameScore([score1, score2 + 1]);
        this.game.GameScore[1] += 1;
        this.dy = -1;
      }
      if (this.game.GameScore[0] > 6 || this.game.GameScore[1] > 6) {
        this.game.GameScore = [0, 0];
        this.app.stage.removeChild(this.ball);
        this.ball.x = this.screenWidth / 2;
        this.ball.y = this.screenHeight / 2;
        this.topRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
        this.bottomRacket.x = this.screenWidth / 2 - this.paddleWidth / 2;
        this.round += 1;
        if (this.round < 3) {
          this.game.GameState = "waiting";
          this.game.setGameState("waiting");
        }
      }
      this.ball.x = this.screenWidth / 2;
      this.ball.y = this.screenHeight / 2;
    }
  }

  async handleWaitingState() {
    const sleepmoment = new Promise((resolve) => setTimeout(resolve, 10000));
    sleepmoment.then(() => {
      this.app.stage.removeChild(this.waitingText);
      this.app.stage.addChild(this.ball);
      this.game.GameState = "start";
      this.game.setGameState("start");
    });
  }
}

export class OnlineGameManager extends PixiManager {
  private socketManager: SocketManager;
  private user: User | null;

  constructor(
    container: HTMLElement,
    backgroundImage: string,
    game: any,
    socketManager: any,
    user: User | null,
  ) {
    super(container, backgroundImage, game);
    this.socketManager = socketManager;
    this.user = user;
    this.game.GameState = "waiting";
    this.game.setGameState("waiting");
  }

  updateBottompaddlePosition() {
    const bottomRacket = this.bottomRacket;
    const app = this.app;

    const baseScreenWidth = 75;
    const scale_x = baseScreenWidth / this.screenWidth;

    if (!bottomRacket || !app) return;

    const movementSpeed = (this.screenWidth / baseScreenWidth) * 4;

    if (
      this.keysPressed.has("ArrowLeft") &&
      !this.keysPressed.has("ArrowRight")
    ) {
      bottomRacket.x = Math.max(0, bottomRacket.x - movementSpeed);
      this.socketManager.sendData({ x: bottomRacket.x * scale_x });
    }

    if (
      this.keysPressed.has("ArrowRight") &&
      !this.keysPressed.has("ArrowLeft")
    ) {
      bottomRacket.x = Math.min(
        this.screenWidth - bottomRacket.width,
        bottomRacket.x + movementSpeed,
      );
      this.socketManager.sendData({ x: bottomRacket.x * scale_x });
    }
  }

  updateToppaddlePosition(x: number) {
    if (x >= 0 && x <= this.screenWidth - this.paddleWidth)
      this.topRacket.x = x;
  }

  updatePaddlePosition() {
    this.updateBottompaddlePosition();
  }

  updateBallPosition(data?: { x: number; y: number }): void {
    if (data) {
      const scale_x = this.screenWidth / 75;
      const scale_y = this.screenHeight / 100;

      const new_x = scale_x * data.x;
      const new_y = scale_y * data.y;

      if (this.isTopPaddle) {
        this.ball.x = this.screenWidth - new_x;
        this.ball.y = this.screenHeight - new_y;
      }
      if (!this.isTopPaddle) {
        this.ball.x = new_x;
        this.ball.y = new_y;
      }
    }
  }

  updateScore(data: { score: { mine: number; opponent: number } }) {
    this.game.GameScore = [data.score.mine, data.score.opponent];
  }

  async handleWaitingState() {}
}
