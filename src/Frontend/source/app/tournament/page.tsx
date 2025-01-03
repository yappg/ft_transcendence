'use client';

import React, { useState } from 'react';
import Tournament from './tournament';
import TournamentForm from './tournament-form';
import { Player } from '@/context/GlobalContext';
import { useGame } from '@/context/GameContext';

const App = () => {
  const game = useGame();

  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [players, setPlayers] = useState([]);

  const handleStartTournament = (selectedPlayers: any) => {
    setPlayers(selectedPlayers);
    setTournamentStarted(true);
  };

  // Function to create a single-elimination tree dynamically
  const createTree = (players: Player[]): any => {
    console.log('players:', players);
    if (players.length === 1) {
      return { data: { player: players[0] } };
    }

    const mid = Math.floor(players.length / 2);
    return {
      data: { player: { avatar: '', username: '' } },
      right: createTree(players.slice(0, mid)),
      left: createTree(players.slice(mid)),
    };
  };

  const myTree = tournamentStarted ? createTree(players) : null;
  game.TournementTree = myTree;
  game.setTournementTree(myTree);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-gradient dark:bg-linear-gradient-dark">
      {!tournamentStarted ? (
        <TournamentForm onStartTournament={handleStartTournament} />
      ) : (
        <Tournament />
      )}
    </div>
  );
};

export default App;
