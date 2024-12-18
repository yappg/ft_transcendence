/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useRef, useEffect } from 'react';
import PixiManager from './pixi-manager';
import SocketManager from './socket-manager';
import { useGame } from '@/context/GameContext';

const GameTable = ({ mode, map }: { map: string; mode: string }) => {
  const game = useGame();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const pixiManagerRef = useRef<PixiManager | null>(null);
  const socketManagerRef = useRef<SocketManager | null>(null);

  useEffect(() => {
    if (game.GameState === 'start') {
      (async () => {
        setTimeout(() => {}, 500000);
      })();
      if (canvasContainerRef.current) {
        pixiManagerRef.current = new PixiManager(
          canvasContainerRef.current,
          'nakebli',
          `/${map}.png`,
          mode,
          game
          // setGameScore,
          // GameScore
        );
        if (mode.indexOf('local') === -1) {
          socketManagerRef.current = new SocketManager(
            'ws://your-backend-url/ws/game/',
            pixiManagerRef.current
          );
        }
      }

      // return () => {
      //   if (pixiManagerRef.current) {
      //     pixiManagerRef.current.destroy();
      //   }
      //   if (socketManagerRef.current) {
      //     socketManagerRef.current.close();
      //   }
      // };
    } else if (game.GameState === 'over') {
      if (pixiManagerRef.current) {
        pixiManagerRef.current.removeGameElements();

        pixiManagerRef.current.renderGameOver();
      }
      // setWinnerPicture('/path/to/winner-picture.png');
    }
  }, [game.GameState]);
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

export default GameTable;
