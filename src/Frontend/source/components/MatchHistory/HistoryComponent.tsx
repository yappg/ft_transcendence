import PlayerCard from '@/components/MatchHistory/PlayerCardComponent';
import { JSX } from 'react';
const MatchHistoryComponent = ({
  Player1,
  Player2,
  ProfilePhoto1,
  ProfilePhoto2,
  level1,
  level2,
  Score1,
  Score2,
}: {
  Player1: string;
  Player2: string;
  ProfilePhoto1: string;
  ProfilePhoto2: string;
  level1: number;
  level2: number;
  Score1: number;
  Score2: number;
}): JSX.Element => {
  {
    return (
      <div className="bg-black-crd flex h-[100px] w-full flex-row items-center gap-3 border-b-2 border-[#1C1C1C] border-opacity-[40%] px-4 md:h-[150px] lg:px-5">
        <PlayerCard
          profilePhoto={ProfilePhoto1}
          playerName={Player1}
          level={level1}
          score={Score1}
          reverse={false}
          isHighScore={Score1 > Score2}
        />
        <div className="flex h-full  w-[10%] items-center justify-center">
          <h1 className="font-dayson text-[#CFCDCD] transition-all duration-300 md:text-[32px] lg:text-[35px] xl:text-[43px] 2xl:text-[50px]">
            VS
          </h1>
        </div>
        <PlayerCard
          profilePhoto={ProfilePhoto2}
          playerName={Player2}
          level={level2}
          score={Score2}
          reverse={true}
          isHighScore={Score2 > Score1}
        />
      </div>
    );
  }
};
export default MatchHistoryComponent;
