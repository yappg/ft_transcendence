'use client';

import { LocalGameManager, PixiManager } from '@/components/game/pixi';
import React, { useRef, useEffect, useState } from 'react';

const GameArena = ({ mode, map }: { map: string; mode: string }) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const gameManagerRef = useRef<PixiManager | null>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      gameManagerRef.current = new LocalGameManager(canvasContainerRef.current, `/earth.png`, mode);
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

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div
        ref={canvasContainerRef}
        id="table"
        className="h-[700px] w-[500px] overflow-hidden rounded-[20px]"
      />
    </div>
  );
};

export default GameArena;
