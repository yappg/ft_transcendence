/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, User } from '@/context/GlobalContext';
import { useGame } from '@/context/GameContext';
import { useEffect } from 'react';
import { RoundsProps } from '@/context/GameContext';
// const [playerScore, setplayerScore] = useState();
const PlayerScore = ({ player, score, isme }: { player: User; score: number; isme: boolean }) => {
  return (
    <div className={`flex h-4/5 w-2/5 items-center ${isme ? '' : 'justify-end'}`}>
      <Avatar className={`h-full w-1/2 ${isme ? '' : 'order-3'}`}>
        <AvatarImage src="/Avatar.svg" alt="avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col font-dayson text-[34px] dark:text-white">
        <div>{player.username}</div>
        <div className={`w-full ${isme ? '' : 'text-end'}`}>{score}</div>
      </div>
    </div>
  );
};

const GameChat = () => {
  const { user } = useUser();
  const { GameScore, Rounds, setRounds, setGameScore } = useGame();

  useEffect(() => {
    console.log('hehehhehehehehhehehe\n');
    console.log('rounds', Rounds);
    if (GameScore[0] >= 7 || GameScore[1] >= 7) {
      // Create a new round object
      const newRound = {
        round: Rounds.length + 1,
        winner: GameScore[0] > GameScore[1] ? 'Player 1' : 'Player 2',
      };

      // Use the functional update form of setRounds to ensure the most current state is used
      setRounds((prevRounds) => {
        const updatedRounds = [...prevRounds, newRound];
        console.log('Updated Rounds:', updatedRounds); // To see the updated rounds before setRounds
        return updatedRounds;
      });

      // Reset game score for the next round
      setGameScore([0, 0]);

      // If the rounds have reached 5, declare game over
      if (Rounds.length === 5) {
        // You can perform game over logic here if necessary
        console.log('Game Over');
      }
    }
  }, [GameScore, setRounds, setGameScore, Rounds]);
  //   if (GameScore[0] >= 7 || GameScore[1] >= 7) {
  //     const newRound = {
  //       round: Rounds.length + 1,
  //       winner: GameScore[0] > GameScore[1] ? 'Player 1' : 'Player 2',
  //     };
  //     // setRounds([...Rounds, newRound]);
  //     setRounds((prevRounds: RoundsProps[]) => {
  //       const updatedRounds = [...prevRounds, newRound];
  //       console.log('Updated Rounds:', updatedRounds); // To see the updated rounds before setRounds
  //       return updatedRounds;
  //     });
  //     console.log(Rounds);
  //     // set the game score to 0
  //     // and pass to the next round until the 5th round end finish and we declare the winner
  //     setGameScore([0, 0]);
  //     // if (Rounds.length === 5) {
  //     //   // console.log('Game Over');
  //     //   // setGameOver(true);
  //     //   // setGameWinner(GameScore[0] > GameScore[1] ? 'Player 1' : 'Player 2');
  //     // }
  //   }
  // }, [GameScore, setRounds, setGameScore, Rounds]);

  return (
    <div className="flex flex-col items-center justify-around gap-8">
      <Link
        href={'#'}
        className="flex h-[60px] w-full items-center justify-start font-dayson text-[48px] dark:text-white"
      >
        <IoIosArrowBack /> <span>Game Arena</span>
      </Link>
      <div className="flex h-[170px] w-full items-end justify-between">
        <PlayerScore player={user || ({} as User)} score={GameScore[0]} isme={true} />
        <img src="/logo.svg" alt="logo" className="h-full" />
        <PlayerScore player={user || ({} as User)} score={GameScore[1]} isme={false} />
      </div>
      <div className="flex h-[250px] w-full items-end justify-between rounded-[20px] bg-black">
        {/* rounds  */}
        <div className="flex h-full w-1/2 items-center justify-around">
          {Rounds.map((round, index) => (
            <div key={index} className="flex flex-col items-center justify-around">
              <div className="text-[24px] dark:text-white">{round.round}</div>
              <div className="text-[24px] dark:text-white">{round.winner}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameChat;
