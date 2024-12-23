/* eslint-disable tailwindcss/classnames-order */
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
      <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full flex-col lg:gap-8 lg:p-8 xl:flex-row">
        <div className="h-1/5 w-full xl:w-2/6">
          <ScoreTable></ScoreTable>
        </div>
        {/* game table */}
        <div className="h-full overflow-hidden xl:w-3/6 justify-center items-center flex border-black border-4 rounded-2xl bg-black">
          <GameTable mode={mode || ''} map={map || ''} />
        </div>
        {/* abilities */}
        <div className="col-start-7 col-end-8 h-[100px] bg-slate-400"></div>
      </div>
    </GameProvider>
  );
};

export default GameArena;
