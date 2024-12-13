// PixiManager.ts
import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { Assets, Sprite, Graphics } from 'pixi.js';

class PixiManager {
  app: PIXI.Application;
  topRacket!: PIXI.Graphics;
  bottomRacket!: PIXI.Graphics;
  ball!: PIXI.Graphics;
  currentUserId: string | undefined;
  backgroundImage: string;

  constructor(container: HTMLElement, currentUserId: string | undefined, backgroundImage: string) {
    this.app = new PIXI.Application();
    this.currentUserId = currentUserId;
    this.backgroundImage = backgroundImage;

    this.init(container);
  }

  async init(container: HTMLElement) {
    await this.app.init({
      background: '#000000',
      resizeTo: document.getElementById('table') as HTMLElement | Window | undefined,
    });
    container.appendChild(this.app.canvas);
    const backgroundTexture = await Assets.load(this.backgroundImage);
    const background = new Sprite(backgroundTexture);
    background.width = this.app.screen.width;
    background.height = this.app.screen.height;
    background.alpha = 0.3;

    this.app.stage.addChild(background);

    this.topRacket = this.createRacket(
      this.app.screen.width / 2 - 75,
      20,
      170,
      25,
      0xff0000,
      0x000000
    );
    this.bottomRacket = this.createRacket(
      this.app.screen.width / 2 - 75,
      this.app.screen.height - 55,
      170,
      25,
      0x00ffff,
      0x000000
    );

    this.ball = this.createBall(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
      17,
      0xffffff
    );

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

  updateGameState(data: any) {
    const { ballPosition, topRacketPosition, bottomRacketPosition, playerId } = data;

    const isCurrentPlayerAtBottom = this.currentUserId === playerId;

    this.updateRacketPosition(false, topRacketPosition);
    this.updateRacketPosition(true, bottomRacketPosition);
    this.updateBallPosition(
      ballPosition.x,
      isCurrentPlayerAtBottom ? ballPosition.y : this.app.screen.height - ballPosition.y
    );
  }

  updateScores(data: any) {
    const { topScore, bottomScore } = data;
    // Update score display logic
  }

  handleGameEvent(data: any) {
    const { event } = data;
    if (event === 'gameOver') {
      // Handle game over event
    } else if (event === 'gameStart') {
      // Handle game start event
    } else if (event === 'gamePause') {
      // Handle game pause event
    }
  }

  // Keyboard event listener
  handleKeyDown = (event: KeyboardEvent) => {
    const bottomRacket = this.bottomRacket;
    const app = this.app;

    if (!bottomRacket || !app) return;

    const movementSpeed = 10;
    let newPosition;
    switch (event.key) {
      case 'ArrowLeft':
        newPosition = Math.max(0, bottomRacket.x - movementSpeed);
        bottomRacket.x = newPosition;
        // sendRacketPosition('bottom', newPosition);
        break;
      case 'ArrowRight':
        newPosition = Math.min(
          app.screen.width - bottomRacket.width,
          bottomRacket.x + movementSpeed
        );
        bottomRacket.x = newPosition;
        // sendRacketPosition('bottom', newPosition);
        break;
    }
  };
  // const sendRacketPosition = (player: 'top' | 'bottom', position: number) => {
  //   if (socketRef.current) {
  //     socketRef.current.send(
  //       JSON.stringify({
  //         type: 'moveRacket',
  //         player,
  //         position,
  //       })
  //     );
  //   }

  updateBallPosition(x: number, y: number) {
    this.ball.position.set(x, y);
  }

  updateRacketPosition(isBottom: boolean, x: number) {
    if (isBottom) {
      this.bottomRacket.position.x = x;
    } else {
      this.topRacket.position.x = x;
    }
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true, true);
    }
  }
}

export default PixiManager;
