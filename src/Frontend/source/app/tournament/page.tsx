"use client";

import React, { useEffect, useState } from "react";
import Tournament from "./tournament";
import TournamentForm from "./tournament-form";
import { useGame, Player } from "@/context/GameContext";
import GameArena from "../Game-Arena/page";

const App = () => {
  const game = useGame();

  const [tournamentStarted, setTournamentStarted] = useState(false);

  const handleStartTournament = (players: Player[]) => {
    const myTree = createTree(players);
    game.setTournementTree(myTree);
    setTournamentStarted(true);
  };

  const createTree = (players: Player[]): any => {
    if (players.length === 1) {
      return { data: { player: players[0] } };
    }

    const mid = Math.floor(players.length / 2);
    return {
      data: { player: { avatar: "", username: "" } },
      right: createTree(players.slice(0, mid)),
      left: createTree(players.slice(mid)),
    };
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-gradient dark:bg-linear-gradient-dark">
      {!tournamentStarted ? (
        <div className="flex w-4/5 items-center justify-center">
          <TournamentForm onStartTournament={handleStartTournament} />
        </div>
      ) : game.inGame ? (
        <GameArena />
      ) : (
        <div className="flex size-full items-center justify-center lg:p-32">
          <Tournament />
        </div>
      )}
    </div>
  );
};

export default App;
