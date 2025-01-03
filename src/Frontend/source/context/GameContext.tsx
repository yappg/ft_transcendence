import { createContext, ReactNode, useContext, useState } from 'react';
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
  player1: Player;
  setPlayer1: (player: Player) => void;
  player2: Player;
  setPlayer2: (player: Player) => void;
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
  totalScore: [number, number];
  setTotalScore: (score: [number, number]) => void;
  GameWinner: string | null;
  setGameWinner: (winner: string | null) => void;
}

const GameContext = createContext<GameContextType>({
  GameId: 0,
  setGameId: () => {},
  player1: { username: 'player1', avatar: '/Avatar.svg' },
  setPlayer1: () => {},
  player2: { username: 'player2', avatar: '/Avatar.svg' },
  setPlayer2: () => {},
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
  totalScore: [0, 0],
  setTotalScore: () => {},
  GameWinner: null,
  setGameWinner: () => {},
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
  const [totalScore, setTotalScore] = useState<[number, number]>([0, 0]);
  const [GameWinner, setGameWinner] = useState<string | null>(null);
  const [player1, setPlayer1] = useState<Player>({ username: 'player1', avatar: '/Avatar.svg' });
  const [player2, setPlayer2] = useState<Player>({ username: 'player2', avatar: '/Avatar.svg' });
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
