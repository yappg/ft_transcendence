import { History, useUser } from "@/context/GlobalContext";
import MatchHistoryBoard from "./MatchHistoryBoard";

export const MatchHistory = ({
  PlayerMatches,
}: {
  PlayerMatches: History[];
}) => {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[14px] bg-[#4C4D4E] shadow-2xl lg:h-full lg:w-[49%] lg:rounded-[30px]">
      <div className="custom-scrollbar-container h-[85%] w-full overflow-y-scroll">
        {PlayerMatches?.length === 0 || !PlayerMatches ? (
          <div className="flex size-full items-center justify-center">
            <h1 className="text-center font-bold text-white">
              No Match History
            </h1>
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
      <div className="absolute bottom-0 flex h-[15%] w-full items-center justify-end gap-4 border-t-2 border-[#B8B8B8] bg-[#4C4D4E] px-10">
        <h1 className="font-dayson text-[#B8B8B8] lg:text-[15px] 2xl:text-[20px]">
          Match History
        </h1>
        <h1 className="font-dayson text-[#B8B8B8] lg:text-[20px] 2xl:text-[25px]">
          {">"}
        </h1>
      </div>
    </div>
  );
};
