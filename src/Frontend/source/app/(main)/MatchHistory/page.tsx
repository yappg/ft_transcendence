'use client';
import { MatchHistory } from '@/constants/MatchHistory';
import MatchHistoryComponent from '@/components/MatchHistory/HistoryComponent';
import { useContext, useEffect } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { useUser } from '@/context/GlobalContext';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(5);
  }, [setIsActivated]);
  const {PlayerMatches} = useUser();
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto ">
      <div className=" custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll md:rounded-[50px] bg-[#00000099]">
        {
          PlayerMatches?.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <h1 className="text-white text-2xl font-dayson font-bold">No Matches Found</h1>
            </div>
          )
        }
      {PlayerMatches?.map((match: any) => (
          <MatchHistoryComponent
            key={match.id}
            Player1={match.player1.display_name}
            Player2={match.player2.display_name}
            ProfilePhoto1={match.player1.avatar}
            ProfilePhoto2={match.player2.avatar}
            level1={match.player1.level}
            level2={match.player2.level}
            Score1={match.player1_score}
            Score2={match.player2_score}
          />
        ))}
      </div>
    </div>
  );
}
