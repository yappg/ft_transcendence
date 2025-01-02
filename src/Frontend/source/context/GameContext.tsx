import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from './GlobalContext';

export interface RoundsProps {
  round: number;
  winner: string | null;
  score: [number, number];
}

export interface GameContextType {
  GameId: number;
  setGameId: (id: number) => void;
  GameScore: [number, number];
  Rounds: RoundsProps[];
  GameState: 'start' | 'over' | 'round' | 'waiting';
  gameMode: 'local' | 'online';
  gameMap: 'earth' | 'water' | 'fire' | 'air' | 'simple';
  setRounds: (rounds: (prevRounds: RoundsProps[]) => RoundsProps[]) => void;
  setGameScore: (score: [number, number]) => void;
  setGameState: (state: 'start' | 'over' | 'round' | 'waiting') => void;
  setGameMode: (mode: 'local' | 'online') => void;
  setGameMap: (map: 'earth' | 'water' | 'fire' | 'air' | 'simple') => void;
  opponent: User | null;
  setOpponent: (opponent: User | null) => void;
  TournementTree: any;
  setTournementTree: (tree: any) => void;
  // GameWinner: string | null,
  // setGameWinner: (winner: string | null) => void,
}

const GameContext = createContext<GameContextType>({
  GameId: 0,
  setGameId: () => {},
  GameScore: [0, 0],
  setGameScore: () => {},
  Rounds: [],
  setRounds: () => {},
  GameState: 'start',
  setGameState: () => {},
  gameMode: 'local',
  setGameMode: () => {},
  gameMap: 'simple',
  setGameMap: () => {},
  opponent: null,
  setOpponent: () => {},
  TournementTree: null,
  setTournementTree: () => {},
  // GameWinner:null,
  // setGameWinner: () => {},
});

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [GameId, setGameId] = useState<number>(0);
  const [GameScore, setGameScore] = useState<[number, number]>([0, 0]);
  const [Rounds, setRounds] = useState<RoundsProps[]>([]);
  const [GameState, setGameState] = useState<'start' | 'over' | 'round' | 'waiting'>('waiting');
  const [gameMode, setGameMode] = useState<'local' | 'online'>('local');
  const [gameMap, setGameMap] = useState<'earth' | 'water' | 'fire' | 'air' | 'simple'>('simple');
  const [opponent, setOpponent] = useState<User | null>(null);
  const [TournementTree, setTournementTree] = useState<any>(null);
  // const [GameWinner, setGameWinner] = useState<string | null>(null);
  return (
    <GameContext.Provider
      value={{
        GameId,
        setGameId,
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
        // setGameWinner,
        // GameWinner,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }

  return context;
};

export default GameContext;
