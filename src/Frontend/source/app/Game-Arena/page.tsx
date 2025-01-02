'use client';

import React from 'react';
import GameTable from '@/components/game/game-arena';
import { useSearchParams } from 'next/navigation';
import { GameProvider, useGame } from '@/context/GameContext';
import ScoreTable from '@/components/game/game-score';
import { User, useUser } from '@/context/GlobalContext';

const GameArena = () => {
  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  const mode = searchParams.get('mode');
  const game = useGame();
  const user = useUser();
  let player1: User | null;
  let player2: User | null;
  console.log('TTree:', game.TournementTree);
  console.log('Map:', map);
  console.log('Mode:', mode);
  // console.log('tree:', game.TournementTree);
  console
  if (mode === 'tournament') {
    if (game.TournementTree.right.data.player.username === '') {
      player1 = game.TournementTree.right.right.data.player;
      player2 = game.TournementTree.right.left.data.player;
    }
    else if (game.TournementTree.left.data.player.username === '') {
      player1 = game.TournementTree.left.right.data.player;
      player2 = game.TournementTree.left.left.data.player;
    }
    else {
      player1 = game.TournementTree.right.data.player;
      player2 = game.TournementTree.left.data.player;
    }
  }
  else if (mode === 'one-vs-one') {
    player1 = user.user;
    player2 = game.opponent;
  }
  else {
    player1 = { username: 'player1', avatar: '/Avatar.svg' } as User;
    player2 = { username: 'player2', avatar: '/Avatar.svg' } as User;
  }
  return (
    <GameProvider>
      <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-auto flex-col xl:gap-8 xl:px-8 lg:flex-row">
        <div className="h-[100px] lg:h-full w-full xl:w-auto flex justify-center items-center">
          <ScoreTable player1={player1} player2={player2}></ScoreTable>
        </div>
        {/* game table */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="size-full overflow-hidden max-w-[calc(3*(100vh-200px)/4)] lg:max-w-[calc(280vh/4)] xl:w-5/6 justify-center items-center flex">
            <GameTable mode={mode || ''} map={map || ''} />
          </div>
        </div>
          {/* abilities */}
          <div className="col-start-7 col-end-8 h-[100px] bg-black"></div>
      </div>
    </GameProvider>
  );
};

export default GameArena;
