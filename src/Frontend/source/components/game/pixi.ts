import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { Assets, Sprite, Graphics } from 'pixi.js';

// let dx = 1;
// let dy = 1;

export class PixiManager {
  app: PIXI.Application;
  topRacket!: PIXI.Graphics;
  bottomRacket!: PIXI.Graphics;
  ball!: PIXI.Graphics;
  backgroundImage: string;
  mode: string;
  keysPressed: Set<string> = new Set('');
  paddleWidth: number;
  gameState: string = 'start';
  screenWidth: number;
  screenHeight: number;
  //   paddleHeight: number;

  constructor(container: HTMLElement, backgroundImage: string, mode: string) {
    this.app = new PIXI.Application();
    this.backgroundImage = backgroundImage;
    this.mode = mode;
    this.paddleWidth = 0;
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
      // const funct = async () => {
      //   await setTimeout(() => {}, 50000);
      // };
      // funct();
      this.gameState = 'over';
    }
    if (this.gameState === 'over') {
      this.removeGameElements();
    }
  }

  removeGameElements() {
    this.app.stage.removeChild(this.topRacket);
    this.app.stage.removeChild(this.bottomRacket);
    // this.app.stage.removeChild(this.ball);
    let crayRadius = 10;
    this.app.ticker.add(() => {
      crayRadius += 100;
      this.ball.circle(this.screenWidth / 2, this.screenHeight / 2, crayRadius);
    });
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
