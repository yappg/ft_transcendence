import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { Assets, Sprite, Graphics } from 'pixi.js';

// let dx = 1;
// let dy = 1;

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

  constructor(container: HTMLElement, backgroundImage: string, mode: string, game: any) {
    this.app = new PIXI.Application();
    this.backgroundImage = backgroundImage;
    this.paddleWidth = 0;
    this.game = game;
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
    if (this.gameState === 'start') {
      this.drawGameElements();
      // this.gameState = 'over';
    }
    if (this.gameState === 'over') {
      this.removeGameElements();
    }
  }

  abstract updatePaddlePosition(): void;

  removeGameElements() {
    this.app.stage.removeChild(this.topRacket);
    this.app.stage.removeChild(this.bottomRacket);
  }

  addEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    console.log('Event listeners added');
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
      25,
      0xff0000,
      0x000000
    );
    this.bottomRacket = this.createRacket(
      this.screenWidth / 2 - this.paddleWidth / 2,
      this.screenHeight - 50,
      this.paddleWidth,
      25,
      0x00ffff,
      0x000000
    );

    this.ball = this.createBall(this.screenWidth / 2, this.screenHeight / 2, 15, 0xffffff);

    this.app.stage.addChild(this.topRacket);
    this.app.stage.addChild(this.bottomRacket);
    this.app.stage.addChild(this.ball);
  }

  createBall(x: number, y: number, radius: number, color: number) {
    const ball = new Graphics();
    ball.fill({ color });
    ball.circle(0, 0, radius);
    ball.fill();
    ball.position.set(x, y);
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

    const movementSpeed = 8;

    if (this.keysPressed.has('ArrowLeft') && !this.keysPressed.has('ArrowRight')) {
      bottomRacket.x = Math.max(0, bottomRacket.x - movementSpeed);
      console.log(`Moving leftB: ${bottomRacket.x}`);
    }

    if (this.keysPressed.has('ArrowRight') && !this.keysPressed.has('ArrowLeft')) {
      bottomRacket.x = Math.min(
        app.screen.width - bottomRacket.width,
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
        app.screen.width - this.topRacket.width,
        this.topRacket.x + movementSpeed
      );
      console.log(`Moving rightT: ${this.topRacket.x}`);
    }
    if (this.gameState === 'start') {
      // this.updateBallPositionLocal();
    }
  }
}
