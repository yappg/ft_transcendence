'use client';

import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, User, Player } from '@/context/GlobalContext';
import { useGame } from '@/context/GameContext';
import { useEffect } from 'react';
import { RoundsProps } from '@/context/GameContext';
import { Skeleton } from '../ui/skeleton';

const PlayerScore = ({
  player,
  score,
  isme,
}: {
  player: User | null;
  score: number;
  isme: boolean;
}) => {
  return (
    <div className={`flex h-full w-auto items-start ${isme ? '' : 'items-end'} flex-col gap-1`}>
      <div className="flex items-center justify-center size-[50px] md:size-[60px]">
        {player ? (
          <Avatar
            className={`size-full bg-black-crd max-w-[35px] max-h-[35px] md:max-w-[50px] md:max-h-[50px]`}
          >
            <AvatarImage src="/Avatar.svg" alt="avatar" />
            <AvatarFallback className="bg-black-crd text-[10px]">CN</AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="size-full max-w-[35px] max-h-[35px] md:max-w-[50px] md:max-h-[50px] bg-black-crd dark:bg-white-crd rounded-full" />
        )}
      </div>
      <div
        className={`flex font-poppin text-[10px] dark:text-white xl:text-[15px] w-[100px] lg:w-[150px] text-center'}`}
      >
        <div className={`${isme ? '' : 'order-3'} w-full h-[10px]`}>
          {player ? (
            <p className={`${isme ? '' : 'text-end'} `}>{player.username}</p>
          ) : (
            <Skeleton className="size-full bg-black-crd dark:bg-white-crd rounded-md" />
          )}
        </div>
        <div className={` w-full text-white-crd text-center`}>{score}</div>
      </div>
    </div>
  );
};

const ScoreTable = ({ player1, player2 }: { player1: User | null, player2: User | null}) => {
  const game = useGame();
  const p1 = player1 ? player1 : { username: 'player1' } as User;
  const p2 = player2 ? player2 : { username: 'player2' } as User;

  useEffect(() => {
    if (game.GameScore[0] > 6 || game.GameScore[1] > 6) {
      const newRound = {
        round: game.Rounds.length + 1,
        winner: game.GameScore[0] > game.GameScore[1] ? p1.username : p2.username,
        score: game.GameScore,
      };

      game.setRounds((prevRounds: RoundsProps[]) => {
        const updatedRounds = [...prevRounds, newRound];
        return updatedRounds as RoundsProps[];
      });

      game.setGameScore([0, 0]);
    }
  }, [game]);

  return (
    <div className="flex items-center justify-around gap-1 xl:flex-col xl:gap-8 size-full px-8 relative">
      <Link
        href={'#'}
        className="flex h-[60px] w-auto items-center justify-start font-dayson text-[48px] dark:text-white xl:w-full absolute left-2 top-2"
      >
        <IoIosArrowBack className="size-[20px] md:size-[60px]" />{' '}
        <span className="hidden lg:block">Game Arena</span>
      </Link>

      <div className="size-full flex flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-around p-2 gap-15 font-dayson text-[20px] dark:text-white md:text-[35px]">
          <PlayerScore player={p1} score={game.GameScore[0]} isme={true} />
          <div className="flex h-full text-[10px] w-[100px]  items-center justify-center rounded-[10px] border-2 border-white-crd text-center text-white-crd p-2">
            {game.GameState === 'start' ? (
              <div className="flex lg:flex-col">
                <h1>Round</h1>
                <h3>{game.Rounds.length + 1}</h3>
              </div>
            ) : game.GameState === 'over' ? (
              // <div className="flex size-full flex-col items-center justify-center border-white border-2 rounded-[10px]">
              <div>game over</div>
            ) : (
              <div>get ready</div>
            )}
          </div>
          {/* {mode.indexOf('local') === -1 ? (
            <PlayerScore player={game.opponent} score={game.GameScore[1]} isme={false} />
          ) : ( */}
            <PlayerScore
              player={p2}
              score={game.GameScore[1]}
              isme={false}
            />
          {/* )} */}
        </div>

        <div className="hidden h-fit w-full items-end justify-between rounded-[10px] bg-black-crd lg:flex">
          {/* rounds  */}
          <div className="flex size-full flex-col items-center justify-start overflow-auto h-[200px]">
            <div className="flex h-[50px] w-full items-center justify-around border-b border-black-crd dark:border-white-crd text-[18px] text-black-crd dark:text-white-crd">
              <div className="w-1/3 h-full flex justify-center items-center">{'Round'}</div>
              <div className="w-1/3 h-full border-l border-black-crd dark:border-white-crd flex justify-center items-center">
                {'Winner'}
              </div>
              <div className="w-1/3 h-full border-l border-black-crd dark:border-white-crd flex justify-center items-center">
                {'score'}
              </div>
            </div>
            {game.Rounds.map((round, index) => (
              <div
                key={index}
                className={`flex h-[50px] w-full items-center justify-around ${index == 2 ? '' : 'border-b border-black-crd dark:border-white-crd'} text-[18px] text-black-crd dark:text-white-crd`}
              >
                <div className="w-1/3 h-full flex justify-center items-center">{`${round.round}`}</div>
                <div className="w-1/3 h-full border-l border-black-crd dark:border-white-crd flex justify-center items-center">{`${round.winner}`}</div>
                <div className="w-1/3 h-full border-l border-black-crd dark:border-white-crd flex justify-center items-center">{`${round.score[0]}/${round.score[1]}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
