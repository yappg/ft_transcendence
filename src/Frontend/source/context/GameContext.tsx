import { createContext, ReactNode, useContext, useState } from 'react';

export interface RoundsProps {
  round: number;
  winner: string | null;
}

export interface GameContextType {
  GameScore: [number, number];
  Rounds: RoundsProps[];
  GameState: 'start' | 'over' | 'round' | 'pause';
  setRounds: (rounds: (prevRounds: RoundsProps[]) => RoundsProps[]) => void;
  setGameScore: (score: [number, number]) => void;
  setGameState: (state: 'start' | 'over' | 'round' | 'pause') => void;
  // GameOver: boolean,
  // setGameOver: (over: boolean) => void,
  // GameWinner: string | null,
  // setGameWinner: (winner: string | null) => void,
  // GameRound: number,
  // setGameRound: (round: number) => void,
  // GameRoundWinner: string | null,
  // setGameRoundWinner: (winner: string | null) => void,
}

const GameContext = createContext<GameContextType>({
  GameScore: [0, 0],
  setGameScore: () => {},
  Rounds: [],
  setRounds: () => {},
  GameState: 'start',
  setGameState: () => {},
  // GameOver:false,
  // setGameOver: () => {},
  // GameWinner:null,
  // setGameWinner: () => {},
  // GameRound:0,
  // setGameRound: () => {},
  // GameRoundWinner:null,
  // setGameRoundWinner: () => {},
});

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [GameScore, setGameScore] = useState<[number, number]>([0, 0]);
  const [Rounds, setRounds] = useState<RoundsProps[]>([]);
  const [GameState, setGameState] = useState<'start' | 'over' | 'round' | 'pause'>('start');
  // const [GameOver, setGameOver] = useState<boolean>(false);
  // const [GameWinner, setGameWinner] = useState<string | null>(null);
  // const [GameRound, setGameRound] = useState<number>(0);
  // const [GameRoundWinner, setGameRoundWinner] = useState<string | null>(null);
  return (
    <GameContext.Provider
      value={{
        setGameScore,
        GameScore,
        Rounds,
        setRounds,
        GameState,
        setGameState,
        // setGameOver,
        // GameOver,
        // setGameWinner,
        // GameWinner,
        // setGameRound,
        // GameRound,
        // setGameRoundWinner,
        // GameRoundWinner,
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
// export default GameContext;
