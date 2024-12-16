import { MatchHistory } from "@/constants/MatchHistory";
import MatchHistoryComponent from "@/components/MatchHistory/HistoryComponent"
export default function Page() {
    return(
        <div className="size-full py-4 pl-6">
            <div className="size-full overflow-hidden">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll rounded-[50px]">
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
            </div>
    )
};