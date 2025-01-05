import { History, useUser } from '@/context/GlobalContext';
import MatchHistoryBoard from './MatchHistoryBoard';

export const MatchHistory = ({ PlayerMatches }: { PlayerMatches: History[] }) => {
  return (
    <div className="relative w-full h-[300px] lg:h-full lg:w-[49%] bg-[#4C4D4E] overflow-hidden rounded-[14px] lg:rounded-[30px] shadow-2xl">
      <div className="w-full h-[85%] overflow-y-scroll custom-scrollbar-container">
        {PlayerMatches?.length === 0 || !PlayerMatches ? (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-white font-bold text-center">No Match History</h1>
          </div>
        ) : (
          PlayerMatches?.map((match) => (
            <MatchHistoryBoard
              key={match.id}
              name={match?.player1?.display_name}
              Profile={match?.player1?.avatar}
              Player1score={match?.player1_score || 0}
              Player2score={match?.player2_score || 0}
            />
          ))
        )}
      </div>
      <div className="absolute bottom-0 w-full bg-[#4C4D4E] h-[15%] border-t-2 border-[#B8B8B8] flex items-center justify-end gap-4 px-10">
        <h1 className="2xl:text-[20px] lg:text-[15px] font-dayson text-[#B8B8B8]">Match History</h1>
        <h1 className="2xl:text-[25px] lg:text-[20px] font-dayson text-[#B8B8B8]">{'>'}</h1>
      </div>
    </div>
  );
};
