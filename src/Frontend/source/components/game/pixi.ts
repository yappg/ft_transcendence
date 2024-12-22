import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { Assets, Sprite, Graphics } from 'pixi.js';

export abstract class PixiManager {
  app: PIXI.Application;
  topRacket!: PIXI.Graphics;
  bottomRacket!: PIXI.Graphics;
  ball!: PIXI.Graphics;
  backgroundImage: string;
  keysPressed: Set<string> = new Set('');
  paddleWidth: number;
  gameState: string = 'start';
  screenWidth: number = 0;
  screenHeight: number = 0;
  game: any;
  round = 0;
  dx = 1;
  dy = 1;

  constructor(container: HTMLElement, backgroundImage: string, game: any) {
    this.app = new PIXI.Application();
    this.backgroundImage = backgroundImage;
    this.paddleWidth = 0;
    this.game = game;
    this.game.gameState = 'start';
    this.initWindow(container).then(() => {});
  }

  async initWindow(container: HTMLElement) {
    await this.app.init({
      background: '#000000',
      resizeTo: document.getElementById('table') as HTMLElement | Window | undefined,
    });
    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;
    container.appendChild(this.app.canvas);
    const backgroundTexture = await Assets.load(this.backgroundImage);
    const background = new Sprite(backgroundTexture);
    background.width = this.screenWidth;
    background.height = this.screenHeight;
    this.paddleWidth = this.screenWidth / 5;
    background.alpha = 0.2;
    this.app.stage.addChild(background);
    if (this.game.gameState === 'start') {
      this.drawGameElements();
    }
    if (this.game.gameState === 'over') {
      this.removeGameElements();
    }
  }

  abstract updatePaddlePosition(): void;
  abstract updateBallPosition(): void;

  removeGameElements() {
    this.app.stage.removeChild(this.topRacket);
    this.app.stage.removeChild(this.bottomRacket);
    this.app.stage.removeChild(this.ball);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.keysPressed.add(event.key);
    console.log(`Key down: ${event.key}`);
    console.log(`Keys pressed: ${Array.from(this.keysPressed).join(', ')}`);
  }

  handleKeyUp(event: KeyboardEvent) {
    this.keysPressed.delete(event.key);
    console.log(`Key up: ${event.key}`);
    console.log(`Keys pressed: ${Array.from(this.keysPressed).join(', ')}`);
  }

  drawGameElements() {
    this.topRacket = this.createRacket(
      this.screenWidth / 2 - this.paddleWidth / 2,
      20,
      this.paddleWidth,
      this.screenHeight / 40,
      0xff0000,
      0x000000
    );
    this.bottomRacket = this.createRacket(
      this.screenWidth / 2 - this.paddleWidth / 2,
      this.screenHeight - 50,
      this.paddleWidth,
      this.screenHeight / 40,
      0x00ffff,
      0x000000
    );

    this.ball = this.createBall(0, 0, this.screenWidth / 35, 0xff0000);

    this.app.stage.addChild(this.topRacket);
    this.app.stage.addChild(this.bottomRacket);
    this.app.stage.addChild(this.ball);
    console.log('gamestate', this.game.gameState);
    this.app.ticker.add(() => {
      if (this.game.gameState === 'start') {
        if (this.round < 3) {
          this.updateBallPosition();
          this.updatePaddlePosition();
        } else {
          this.game.gameState = 'over';
          this.game.setGameState('over');
          this.removeGameElements();
        }
      }
    });
  }

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
    glowColor: number
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

    const movementSpeed = 15;

    if (this.keysPressed.has('ArrowLeft') && !this.keysPressed.has('ArrowRight')) {
      bottomRacket.x = Math.max(0, bottomRacket.x - movementSpeed);
      console.log(`Moving leftB: ${bottomRacket.x}`);
    }

    if (this.keysPressed.has('ArrowRight') && !this.keysPressed.has('ArrowLeft')) {
      bottomRacket.x = Math.min(
        this.screenWidth - bottomRacket.width,
        bottomRacket.x + movementSpeed
      );
      console.log(`Moving rightB: ${bottomRacket.x}`);
    }

    if (
      (this.keysPressed.has('a') || this.keysPressed.has('A')) &&
      !this.keysPressed.has('d') &&
      !this.keysPressed.has('D')
    ) {
      this.topRacket.x = Math.max(0, this.topRacket.x - movementSpeed);
      console.log(`Moving leftT: ${this.topRacket.x}`);
    }

    if (
      (this.keysPressed.has('d') || this.keysPressed.has('D')) &&
      !this.keysPressed.has('a') &&
      !this.keysPressed.has('A')
    ) {
      this.topRacket.x = Math.min(
        this.screenWidth - this.topRacket.width,
        this.topRacket.x + movementSpeed
      );
      console.log(`Moving rightT: ${this.topRacket.x}`);
    }
  }
  updateBallPosition() {
    if (!this.ball || !this.app) return;

    const movementSpeed = 5;

    this.ball.x += this.dx * movementSpeed;
    this.ball.y += this.dy * movementSpeed;

    if (this.ball.x <= 0 || this.ball.x >= this.screenWidth) {
      this.dx *= -1;
      this.ball.x += this.dx * movementSpeed;
    }

    if (
      this.ball.y - 10 >= this.topRacket.y &&
      this.ball.y <= this.topRacket.y + this.topRacket.height &&
      this.ball.x >= this.topRacket.x &&
      this.ball.x <= this.topRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;
      this.ball.y += this.dy * movementSpeed;
    }

    if (
      this.ball.y + 10 >= this.bottomRacket.y &&
      this.ball.y <= this.bottomRacket.y + this.bottomRacket.height &&
      this.ball.x >= this.bottomRacket.x &&
      this.ball.x <= this.bottomRacket.x + this.paddleWidth
    ) {
      this.dy *= -1;
      this.ball.y += this.dy * movementSpeed;
    }
    if (this.ball.y <= 0 || this.ball.y >= this.screenHeight) {
      const score1 = this.game.GameScore[0];
      const score2 = this.game.GameScore[1];
      if (this.ball.y <= 0) {
        this.game.setGameScore([score1 + 1, score2]);
        this.game.GameScore[0] += 1;
      } else {
        this.game.setGameScore([score1, score2 + 1]);
        this.game.GameScore[1] += 1;
      }
      if (this.game.GameScore[0] > 6 || this.game.GameScore[1] > 6) {
        this.game.GameScore = [0, 0];
        this.round += 1;
      }
      this.ball.x = this.screenWidth / 2;
      this.ball.y = this.screenHeight / 2;
    }
  }
}
