// 'use client';

import React from 'react';
import GameTable from '@/components/game/game-arena';
// import { useRouter } from 'next/naviation';

interface GameArenaProps {
  params: {
    mode: string;
  };
}

const GameArena: React.FC<GameArenaProps> = async ({ params }) => {
  const { mode } = await params;

  return (
    <div className="grid h-screen w-full grid-cols-7 gap-4 bg-linear-gradient p-8 dark:bg-linear-gradient-dark">
      {/* chat section */}
      <div className="col-start-1 col-end-4 hidden bg-slate-400 lg:block"></div>
      {/* game table */}
      <div
        className="col-start-4 col-end-7 overflow-hidden rounded-[20px] border-[10px] border-black bg-slate-400"
        id="table"
      >
        <GameTable mode={mode} />
      </div>
      {/* abilities */}
      <div className="col-start-7 col-end-8 bg-slate-400"></div>
    </div>
  );
};

export default GameArena;
