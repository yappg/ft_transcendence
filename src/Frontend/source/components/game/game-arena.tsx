//
'use client';

import { LocalGameManager, PixiManager } from '@/components/game/pixi';
import { useGame } from '@/context/GameContext';
import React, { useRef, useEffect, useState } from 'react';

const GameTable = ({ mode, map }: { map: string; mode: string }) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const game = useGame();

  const gameManagerRef = useRef<PixiManager | null>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      gameManagerRef.current = new LocalGameManager(canvasContainerRef.current, `/earth.png`, game);
    }

    return () => {
      if (gameManagerRef.current) {
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

  return <div ref={canvasContainerRef} id="table" className="size-full overflow-hidden" />;
};

export default GameTable;
