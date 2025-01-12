'use client';

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { User } from './GlobalContext';

export interface RoundsProps {
  round: number;
  winner: string | null;
  score: [number, number];
}

export interface Player {
  username: string;
  avatar: string;
}

export interface GameContextType {
  GameId: number;
  setGameId: (id: number) => void;
  player1: Player | null;
  setPlayer1: (player: Player | null) => void;
  player2: Player | null;
  setPlayer2: (player: Player | null) => void;
  GameScore: [number, number];
  Rounds: RoundsProps[];
  GameState: 'start' | 'over' | 'round' | 'waiting';
  gameMode: 'local' | 'online';
  gameMap: string;
  setRounds: (rounds: (prevRounds: RoundsProps[]) => RoundsProps[]) => void;
  setGameScore: (score: [number, number]) => void;
  setGameState: (state: 'start' | 'over' | 'round' | 'waiting') => void;
  setGameMode: (mode: 'local' | 'online') => void;
  setGameMap: (map: string) => void;
  opponent: User | null;
  setOpponent: (opponent: User | null) => void;
  TournementTree: any;
  setTournementTree: (tree: any) => void;
  totalScore: [number, number];
  setTotalScore: (score: [number, number]) => void;
  GameWinner: Player | null;
  setGameWinner: (winner: Player | null) => void;
  inGame: boolean;
  setInGame: (inGame: boolean) => void;
  tournamentMatch: number;
  setTournamentMatch: (match: number) => void;
  resetGame: () => void;
  pixiappready: boolean;
  setPixiappready: (ready: boolean) => void;
}

const GameContext = createContext<GameContextType>({
  GameId: 0,
  setGameId: () => {},
  player1: null,
  setPlayer1: () => {},
  player2: null,
  setPlayer2: () => {},
  GameScore: [0, 0],
  setGameScore: () => {},
  Rounds: [],
  setRounds: () => {},
  GameState: "start",
  setGameState: () => {},
  gameMode: "local",
  setGameMode: () => {},
  gameMap: "simple",
  setGameMap: () => {},
  opponent: null,
  setOpponent: () => {},
  TournementTree: null,
  setTournementTree: () => {},
  totalScore: [0, 0],
  setTotalScore: () => {},
  GameWinner: null,
  setGameWinner: () => {},
  inGame: false,
  setInGame: () => {},
  tournamentMatch: 0,
  setTournamentMatch: () => {},
  resetGame: () => {},
  pixiappready: false,
  setPixiappready: () => {},
});

const emptyTree = {
  data: { player: { avatar: "", username: "" } },
  right: {
    data: { player: { avatar: "", username: "" } },
    right: { data: { player: { avatar: "", username: "" } } },
    left: { data: { player: { avatar: "", username: "" } } }
  },
  left: {
    data: { player: { avatar: "", username: "" } },
    right: { data: { player: { avatar: "", username: "" } } },
    left: { data: { player: { avatar: "", username: "" } } }
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [GameId, setGameId] = useState<number>(0);
  const [GameScore, setGameScore] = useState<[number, number]>([0, 0]);
  const [Rounds, setRounds] = useState<RoundsProps[]>([]);
  const [GameState, setGameState] = useState<'start' | 'over' | 'round' | 'waiting'>('waiting');
  const [gameMode, setGameMode] = useState<'local' | 'online'>('local');
  const [gameMap, setGameMap] = useState<string>('simple');
  const [opponent, setOpponent] = useState<User | null>(null);
  const [TournementTree, setTournementTree] = useState<any>(null);
  const [totalScore, setTotalScore] = useState<[number, number]>([0, 0]);
  const [GameWinner, setGameWinner] = useState<Player | null>(null);
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [inGame, setInGame] = useState<boolean>(false);
  const [tournamentMatch, setTournamentMatch] = useState<number>(0);
  const [pixiappready, setPixiappready] = useState<boolean>(false);
  const resetGame = () => {
    setGameScore([0, 0]);
    setRounds([]);
    setGameState("waiting");
    setTotalScore([0, 0]);
    setGameWinner(null);
    setTournamentMatch(0);
    setTournementTree(emptyTree);
    setInGame(false);
  };
  return (
    <GameContext.Provider
      value={{
        GameId,
        setGameId,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        setGameScore,
        GameScore,
        Rounds,
        setRounds,
        GameState,
        setGameState,
        gameMode,
        setGameMode,
        gameMap,
        setGameMap,
        opponent,
        setOpponent,
        TournementTree,
        setTournementTree,
        totalScore,
        setTotalScore,
        GameWinner,
        setGameWinner,
        inGame,
        setInGame,
        tournamentMatch,
        setTournamentMatch,
        resetGame,
        pixiappready,
        setPixiappready,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }

  return context;
};

export default GameContext;
