import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PlayerCard from '@/components/MatchHistory/PlayerCardComponent';
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
  }): JSX.Element => {{
    return (
        <div className="bg-black-crd flex h-[150px] w-full flex-row items-center border-b-2 border-[#1C1C1C] border-opacity-[40%] px-4 lg:px-5 gap-3">
            <PlayerCard 
                profilePhoto={ProfilePhoto1} 
                playerName={Player1}
                level={level1} 
                score={Score1} 
                reverse={false}
                isHighScore={Score1 > Score2}
                />
                <div className="w-[10%] h-full  flex items-center justify-center">
                    <h1 className="font-dayson 2xl:text-[50px] xl:text-[43px] lg:text-[35px] md:text-[32px] transition-all duration-300 text-[#CFCDCD]">
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