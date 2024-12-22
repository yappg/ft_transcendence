'use client';

import React from 'react';
import GameTable from '@/components/game/game-arena';
import { useSearchParams } from 'next/navigation';
import { GameProvider } from '@/context/GameContext';
import ScoreTable from '@/components/game/game-chat';

const GameArena = () => {
  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  const mode = searchParams.get('mode');

  return (
    <GameProvider>
      <div className="flex flex-col h-screen w-full bg-linear-gradient lg:p-8 lg:gap-8 dark:bg-linear-gradient-dark xl:flex-row">
        <div className="lg:block w-full h-h-1/5">
          <ScoreTable></ScoreTable>
        </div>
        {/* game table */}
        <div className="overflow-hidden rounded-[20px] border-[10px] border-black h-full lg:w-full">
          <GameTable mode={mode || ''} map={map || ''} />
        </div>
        {/* abilities */}
        <div className="col-start-7 col-end-8 bg-slate-400 h-[100px]"></div>
      </div>
    </GameProvider>
  );
};

export default GameArena;
