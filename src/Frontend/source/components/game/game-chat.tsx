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
      <Avatar
        className={`h-full w-auto ${isme ? '' : 'order-3'} hidden bg-blue-400 md:block md:max-h-[100px] md:max-w-[100px]`}
      >
        <AvatarImage src="/Avatar.svg" alt="avatar" />
        <AvatarFallback className="bg-black-crd">CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col font-poppin text-[10px] dark:text-white xl:text-[30px]">
        <div>{player.username}</div>
        <div className={` w-full text-white-crd ${isme ? '' : 'text-end'}`}>{score}</div>
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
  }, [game]);

  return (
    <div className="flex items-center justify-around gap-1 xl:flex-col xl:gap-8">
      <Link
        href={'#'}
        className="flex h-[60px] w-auto items-center justify-start font-dayson text-[48px] dark:text-white xl:w-full"
      >
        <IoIosArrowBack className="size-[20px] md:size-[60px]" />{' '}
        <span className="hidden xl:block">Game Arena</span>
      </Link>

      <div className="flex w-full items-center justify-between p-2 xlp-4 font-dayson text-[20px] dark:text-white md:text-[35px]">
        <PlayerScore player={user || ({} as User)} score={game.GameScore[0]} isme={true} />
        <div className="flex h-[40px] lg:h-auto text-[10px]  items-center justify-center rounded-[10px] border-2 border-white-crd text-center text-white-crd p-2">
          {game.GameState === 'start' ? (
            <div className="flex lg:flex-col">
              <h1>Round</h1>
              <h3>{game.Rounds.length + 1}</h3>
            </div>
          ) : (
            // <div className="flex size-full flex-col items-center justify-center border-white border-2 rounded-[10px]">
            <div>game over</div>
          )}
        </div>
        <PlayerScore player={user || ({} as User)} score={game.GameScore[1]} isme={false} />
      </div>

      <div className="hidden h-fit w-full items-end justify-between rounded-[10px] bg-black-crd xl:flex">
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
