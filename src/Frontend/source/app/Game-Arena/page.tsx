'use client';

import React from 'react';
import GameTable from '@/components/game/game-arena';
import { useSearchParams } from 'next/navigation';
import { GameChat } from '@/components/game/game-chat';
// import { useRouter } from 'next/naviation';

interface GameArenaProps {
  params: {
    mode: string;
  };
}

const GameArena = () => {
  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  const mode = searchParams.get('mode');

  return (
    <div className="grid h-screen w-full grid-cols-7 gap-4 bg-linear-gradient p-8 dark:bg-linear-gradient-dark">
      <div className="col-start-1 col-end-4 hidden lg:block">
        <GameChat></GameChat>
      </div>
      {/* game table */}
      <div
        className="col-start-4 col-end-7 overflow-hidden rounded-[20px] border-[10px] border-black bg-slate-400"
        id="table"
      >
        <GameTable mode={mode || ''} map={map || ''} />
      </div>
      {/* abilities */}
      <div className="col-start-7 col-end-8 bg-slate-400"></div>
    </div>
  );
};

export default GameArena;
