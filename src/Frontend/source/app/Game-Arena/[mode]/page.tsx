'use client';

import React from 'react';
import GameTable from '@/components/game/game-arena';

const GameArena = () => {
  return (
    <div className="w-full h-screen bg-linear-gradient p-8 dark:bg-linear-gradient-dark grid grid-cols-7 gap-4">
      {/* chat section */}
      <div className="hidden lg:block col-start-1 col-end-4 bg-slate-400"></div>
      {/* game table */}
      <div className="col-start-4 col-end-7 bg-slate-400 rounded-[20px] overflow-hidden border-[10px] border-black" id="table">
        <GameTable />
      </div>
      {/* gameplay abilities */}
      <div className="col-start-7 col-end-8 bg-slate-400">

      </div>
    </div>
  );
};

export default GameArena;
