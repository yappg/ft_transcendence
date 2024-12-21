'use client';
import { MatchHistory } from '@/constants/MatchHistory';
import MatchHistoryComponent from '@/components/MatchHistory/HistoryComponent';
import { useContext, useEffect } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(5);
  }, [setIsActivated]);
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll md:rounded-[50px]">
        {MatchHistory.map((match, index) => (
          <MatchHistoryComponent
            key={index}
            Player1={match.player1}
            Player2={match.player2}
            ProfilePhoto1={match.player1Photo}
            ProfilePhoto2={match.player2Photo}
            level1={match.player1Level}
            level2={match.player2Level}
            Score1={match.player1Score}
            Score2={match.player2Score}
          />
        ))}
      </div>
    </div>
  );
}
