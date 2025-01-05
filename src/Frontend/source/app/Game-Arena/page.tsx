/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';
import GameTable from '@/components/game/game-arena';
import { useSearchParams } from 'next/navigation';
import { Player, useGame } from '@/context/GameContext';
import ScoreTable from '@/components/game/game-score';
import { useUser } from '@/context/GlobalContext';

const GameArena = () => {
  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  const mode = searchParams.get('mode');
  const game = useGame();
  const user = useUser();

  useEffect(() => {
    // alert('game arena');
    console.log('tournament match:', game.tournamentMatch);
    if (mode === 'tournament') {
      if (game.tournamentMatch === 0) {
        game.setPlayer1(game.TournementTree.right.right.data.player);
        game.setPlayer2(game.TournementTree.right.left.data.player);
      } else if (game.tournamentMatch === 1) {
        alert('waaaaa l3adaw');
        game.setPlayer1(game.TournementTree.left.right.data.player);
        game.setPlayer2(game.TournementTree.left.left.data.player);
      } else {
        console.log('else-----:');
        game.setPlayer1(game.TournementTree.right.data.player);
        game.setPlayer2(game.TournementTree.left.data.player);
      }
    } else if (mode === 'one-vs-one') {
      game.setPlayer1({
        username: user?.user?.username || '',
        avatar: user?.user?.avatar || '',
      } as Player);
      game.setPlayer2({
        username: game.opponent?.username || '',
        avatar: game.opponent?.avatar || '',
      } as Player);
    } else {
      game.setPlayer1({ username: 'player1', avatar: '/Avatar.svg' } as Player);
      game.setPlayer2({ username: 'player2', avatar: '/Avatar.svg' } as Player);
    }
  }, [mode, user, game.opponent, game.TournementTree]);

  return (
    <div className="flex h-screen w-full flex-col bg-linear-gradient dark:bg-linear-gradient-dark lg:flex-row xl:gap-8 xl:px-8">
      <div className="flex h-[100px] w-full items-center justify-center lg:h-full xl:w-auto">
        <ScoreTable mode={mode || ''} map={map || ''}></ScoreTable>
      </div>
      {/* game table */}
      <div className="flex size-full items-center justify-center">
        <div className="flex size-full max-w-[calc(3*(100vh-200px)/4)] items-center justify-center overflow-hidden lg:max-w-[calc(280vh/4)] xl:w-5/6">
          <GameTable mode={mode || ''} map={map || ''} />
        </div>
      </div>
      {/* abilities */}
      <div className="col-start-7 col-end-8 h-[100px] bg-black"></div>
    </div>
  );
};

export default GameArena;
