'use client';

import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, User } from '@/context/GlobalContext';
import { useGame } from '@/context/GameContext';
import { useEffect } from 'react';
import { RoundsProps } from '@/context/GameContext';

const PlayerScore = ({ player, score, isme }: { player: User; score: number; isme: boolean }) => {
  return (
    <div className={`flex h-4/5 w-2/5 items-center gap-2 ${isme ? '' : 'justify-end'}`}>
      <Avatar className={`h-fit w-1/2 ${isme ? '' : 'order-3'}`}>
        <AvatarImage src="/Avatar.svg" alt="avatar" />
        <AvatarFallback className="bg-black-crd">CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col font-dayson text-[25px] dark:text-white lg:text-[30px]">
        <div>{player.username}</div>
        <div className={`w-full ${isme ? '' : 'text-end'}`}>{score}</div>
      </div>
    </div>
  );
};

const ScoreTable = () => {
  const { user } = useUser();
  const game = useGame();

  useEffect(() => {
    if (game.GameScore[0] > 6 || game.GameScore[1] > 6) {
      const newRound = {
        round: game.Rounds.length + 1,
        winner: game.GameScore[0] > game.GameScore[1] ? 'Player 1' : 'Player 2',
      };

      game.setRounds((prevRounds: RoundsProps[]) => {
        const updatedRounds = [...prevRounds, newRound];
        return updatedRounds as RoundsProps[];
      });

      game.setGameScore([0, 0]);
    }
    if (game.Rounds.length == 3) {
      console.log('Game Over');
      game.setGameState('over');
      // .removeGameElements();
    }
  }, [game]);

  return (
    <div className="flex flex-col items-center justify-around gap-8">
      <Link
        href={'#'}
        className="flex h-[60px] w-full items-center justify-start font-dayson text-[48px] dark:text-white"
      >
        <IoIosArrowBack /> <span>Game Arena</span>
      </Link>
      <div className="flex h-[170px] w-full items-end justify-between">
        <PlayerScore player={user || ({} as User)} score={game.GameScore[0]} isme={true} />
        {game.GameState === 'start' ? (
          <div className="flex h-full w-fit flex-col items-center justify-center font-dayson text-[40px] dark:text-white">
            <h1 className="">Round</h1>
            <h3>{game.Rounds.length + 1}</h3>
          </div>
        ) : (
          <div className="flex size-full flex-col items-center justify-center font-dayson text-[40px] dark:text-white">
            game over
          </div>
        )}
        <PlayerScore player={user || ({} as User)} score={game.GameScore[1]} isme={false} />
      </div>
      <div className="flex h-fit w-full items-end justify-between rounded-[10px] bg-black-crd">
        {/* rounds  */}
        <div className="flex size-full flex-col items-center justify-around overflow-auto">
          {game.Rounds.map((round, index) => (
            <div
              key={index}
              className="flex h-[90px] w-full items-center justify-around border-b border-[rgb(255,255,255,0.3)]"
            >
              <div className="text-[24px] text-white">{`Round ${round.round}`}</div>
              <div className="text-[24px] text-white">{`Winner ${round.winner}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
