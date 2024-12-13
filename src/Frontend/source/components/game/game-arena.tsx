// 'use client';

// import React, { useEffect, useRef } from 'react';
// import { Application, Graphics, Sprite, Assets } from 'pixi.js';
// import { GlowFilter } from 'pixi-filters';
// import { useAuth } from '@/context/AuthContext';

// const GameTable = () => {
//   const canvasContainerRef = useRef<HTMLDivElement | null>(null);
//   const topRacketRef = useRef<Graphics | null>(null);
//   const bottomRacketRef = useRef<Graphics | null>(null);
//   const ballRef = useRef<Graphics | null>(null);
//   const appRef = useRef<Application | null>(null);
//   const socketRef = useRef<WebSocket | null>(null);
//   const auth = useAuth();

//   useEffect(() => {
//     const initPixi = async () => {
//       const app = new Application();
//       appRef.current = app;

//       await app.init({
//         background: '#000000',
//         resizeTo: document.getElementById('table') as HTMLElement | Window | undefined,
//       });

//       if (canvasContainerRef.current) {
//         canvasContainerRef.current.appendChild(app.view);
//       }

//       const backgroundTexture = await Assets.load('/earth.png');
//       const background = new Sprite(backgroundTexture);
//       background.width = app.screen.width;
//       background.height = app.screen.height;
//       background.alpha = 0.3;

//       app.stage.addChild(background);

//       const createBall = (x: number, y: number, radius: number, color: number) => {
//         const ball = new Graphics();
//         ball.beginFill(color);
//         ball.drawCircle(0, 0, radius);
//         ball.endFill();
//         ball.position.set(x, y);
//         return ball;
//       };

//       const createRacket = (
//         x: number,
//         y: number,
//         width: number,
//         height: number,
//         color: number,
//         glowColor: number
//       ) => {
//         const racket = new Graphics();

//         racket.beginFill(color);
//         racket.drawRoundedRect(0, 0, width, height, 10);
//         racket.endFill();

//         racket.position.set(x, y);

//         const glowFilter = new GlowFilter({
//           distance: 15,
//           outerStrength: 3,
//           innerStrength: 3,
//           color: glowColor,
//           quality: 1,
//         });
//         racket.filters = [glowFilter];

//         return racket;
//       };

//       const topRacket = createRacket(app.screen.width / 2 - 75, 20, 170, 25, 0xff0000, 0x000000);
//       const bottomRacket = createRacket(
//         app.screen.width / 2 - 75,
//         app.screen.height - 55,
//         170,
//         25,
//         0x00ffff,
//         0x000000
//       );

//       const ball = createBall(app.screen.width / 2, app.screen.height / 2, 17, 0xffffff);

//       app.stage.addChild(topRacket);
//       app.stage.addChild(bottomRacket);
//       app.stage.addChild(ball);

//       topRacketRef.current = topRacket;
//       bottomRacketRef.current = bottomRacket;
//       ballRef.current = ball;

//       const socket = new WebSocket('ws://your-backend-url/ws/game/');
//       socketRef.current = socket;

//       socket.onopen = () => {
//         console.log('WebSocket connection established');
//       };

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         handleSocketMessage(data);
//       };

//       socket.onclose = () => {
//         console.log('WebSocket connection closed');
//       };

//       socket.onerror = (error) => {
//         console.log('WebSocket error:', error);
//       };

//       return () => {
//         app.destroy(true, true);
//       };
//     };

//     initPixi();

//     return () => {
//       if (appRef.current) {
//         appRef.current.destroy(true, true);
//       }
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   const handleSocketMessage = (data: any) => {
//     // Handle incoming WebSocket messages
//     switch (data.type) {
//       case 'gameUpdate':
//         updateGameState(data);
//         break;
//       case 'scoreUpdate':
//         updateScores(data);
//         break;
//       case 'gameEvent':
//         handleGameEvent(data);
//         break;
//       default:
//         break;
//     }
//   };

//   const updateGameState = (data: any) => {
//     const { ballPosition, topRacketPosition, bottomRacketPosition, topPlayerUsername } = data;
//     if ( auth.user === topPlayerUsername) {
//       if (topRacketRef.current) {
//         topRacketRef.current.x = bottomRacketPosition;
//       }
//       if (bottomRacketRef.current) {
//         bottomRacketRef.current.x = topRacketPosition;
//       }
//     } else {
//       if (bottomRacketRef.current) {
//         bottomRacketRef.current.x = bottomRacketPosition;
//       }
//       if (topRacketRef.current) {
//         topRacketRef.current.x = topRacketPosition;
//       }
//     }

//     if (ballRef.current && appRef.current) {
//       ballRef.current.x = ballPosition.x;
//       ballRef.current.y = auth.user === topPlayerUsername ? appRef.current.screen.height - ballPosition.y : ballPosition.y;
//     }
//   };

//   const updateScores = (data: any) => {
//     const { topScore, bottomScore } = data;
//   };

//   const handleGameEvent = (data: any) => {
//     const { event } = data;
//     if (event === 'gameOver') {
//     } else if (event === 'gameStart') {
//     } else if (event === 'gamePause') {
//     }
//   };
//   // Keyboard event listener
//   const handleKeyDown = (event: KeyboardEvent) => {
//     const topRacket = topRacketRef.current;
//     const bottomRacket = bottomRacketRef.current;
//     const app = appRef.current;

//     if (!topRacket || !bottomRacket || !app) return;

//     const movementSpeed = 10;
//     let newPosition;
//     switch (event.key) {
//       case 'ArrowLeft':
//         newPosition = Math.max(0, bottomRacket.x - movementSpeed);
//         bottomRacket.x = newPosition;
//         sendRacketPosition('bottom', newPosition);
//         break;
//       case 'ArrowRight':
//         newPosition = Math.min(
//           app.screen.width - bottomRacket.width,
//           bottomRacket.x + movementSpeed
//         );
//         bottomRacket.x = newPosition;
//         sendRacketPosition('bottom', newPosition);
//         break;
//     }
//   };
//   const sendRacketPosition = (player: 'top' | 'bottom', position: number) => {
//     if (socketRef.current) {
//       socketRef.current.send(
//         JSON.stringify({
//           type: 'moveRacket',
//           player,
//           position,
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);

//   return (
//     <div ref={canvasContainerRef} style={{ width: 'full', height: 'full', overflow: 'hidden' }} />
//   );
// };

// export default GameTable;

//   useEffect(() => {
//     const initPixi = async () => {
//       const app = new Application();
//       appRef.current = app;

//       await app.init({
//         background: '#000000',
//         resizeTo: document.getElementById('table') as HTMLElement | Window | undefined,
//       });

//       if (canvasContainerRef.current) {
//         canvasContainerRef.current.appendChild(app.view);
//       }

//       const backgroundTexture = await Assets.load('/earth.png');
//       const background = new Sprite(backgroundTexture);
//       background.width = app.screen.width;
//       background.height = app.screen.height;
//       background.alpha = 0.3;

import React, { useRef, useEffect } from 'react';
import PixiManager from './pixi-manager';
import SocketManager from './socket-manager';

const GameArena = () => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const pixiManagerRef = useRef<PixiManager | null>(null);
  const socketManagerRef = useRef<SocketManager | null>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      pixiManagerRef.current = new PixiManager(canvasContainerRef.current, auth.user?.username);
      socketManagerRef.current = new SocketManager(
        'ws://your-backend-url/ws/game/',
        pixiManagerRef.current
      );
    }

    return () => {
      if (pixiManagerRef.current) {
        pixiManagerRef.current.destroy();
      }
      if (socketManagerRef.current) {
        socketManagerRef.current.close();
      }
    };
  }, []);
  useEffect(() => {
    if (pixiManagerRef.current) {
      window.addEventListener('keydown', (event) => pixiManagerRef!.current!.handleKeyDown(event));
    }
    return () => {
      window.removeEventListener('keydown', (event) =>
        pixiManagerRef!.current!.handleKeyDown(event)
      );
    };
  }, []);

  return <div ref={canvasContainerRef} id="table" />;
};

export default GameArena;
