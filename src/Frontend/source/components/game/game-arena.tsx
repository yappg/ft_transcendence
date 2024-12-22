/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { LocalGameManager, PixiManager } from '@/components/game/pixi';
import { useGame } from '@/context/GameContext';
import React, { useRef, useEffect } from 'react';

const GameTable = ({ mode, map }: { map: string; mode: string }) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const game = useGame();

  const gameManagerRef = useRef<PixiManager | null>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      gameManagerRef.current = new LocalGameManager(
        canvasContainerRef.current,
        `/${map}.png`,
        game
      );
    }

    return () => {
      if (gameManagerRef.current?.app) {
        gameManagerRef.current.app.destroy(true);
      }
    };
  }, []);

  useEffect(() => {
    if (gameManagerRef.current) {
      window.addEventListener('keydown', (event) => gameManagerRef!.current!.handleKeyDown(event));
      window.addEventListener('keyup', (event) => gameManagerRef!.current!.handleKeyUp(event));
    }
    return () => {
      window.removeEventListener('keydown', (event) =>
        gameManagerRef!.current!.handleKeyDown(event)
      );
    };
  }, []);

  return (
    // <div
    //   ref={canvasContainerRef}
    //   id="table"
    //   className="aspect-auto sm:w-400px aspect-h-4  aspect-w-3 max-h-[60vh] w-full overflow-hidden rounded-[20px] border-[10px] border-black"
    // />
    <div
      ref={canvasContainerRef}
      id="table"
      className="overflow-hidden rounded-[20px] border-[10px] border-black"
      style={{
        height: '900vh',
        width: 'calc(180vh / 3)',
        maxHeight: '100%',
        maxWidth: '100%',
      }}
    />
  );
};

export default GameTable;
