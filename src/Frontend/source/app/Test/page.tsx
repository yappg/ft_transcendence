'use client';

import { PixiManager } from '@/components/game/pixi';
import React, { useRef, useEffect, useState } from 'react';

const GameArena = ({ mode, map }: { map: string; mode: string }) => {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const gameManagerRef = useRef<PixiManager | null>(null);

  useEffect(() => {
    if (canvasContainerRef.current) {
      gameManagerRef.current = new PixiManager(canvasContainerRef.current, `/earth.png`, mode);
      gameManagerRef.current.drawGameElements();
    }

    // return () => {
    //   if (gameManagerRef.current) {
    //     gameManagerRef.current.app.destroy(true);
    //   }
    // };
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-300">
      <div
        ref={canvasContainerRef}
        id="table"
        className="size-[90%] overflow-hidden rounded-[20px]"
      />
    </div>
  );
};

export default GameArena;
