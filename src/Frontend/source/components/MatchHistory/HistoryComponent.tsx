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
    map_played,
  }: {
    Player1: string;
    Player2: string;
    ProfilePhoto1: string;
    ProfilePhoto2: string;
    level1: number;
    level2: number;
    Score1: number;
    Score2: number;
    map_played: string;
  }): JSX.Element => {
    console.log('map_played', map_played);
    const getBackgroundStyle = () => {
      if (map_played === 'fire') {
        return {
          backgroundImage: 'url("/FireMode.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      if(map_played === 'air' || map_played === 'Air'){
        return {
          backgroundImage: 'url("/AirMode.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      if(map_played === 'earth' || map_played === 'Earth'){
        return {
          backgroundImage: 'url("/EarthMode.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      if(map_played === 'water' || map_played === 'Water'){
        return {
          backgroundImage: 'url("/WaterMode.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      // Add more conditions for other maps if needed
      return {};
    };

    return (
        <div className="relative bg-black-crd flex md:h-[150px] h-[100px] w-full flex-row items-center border-b-2 border-[#1C1C1C] border-opacity-[40%] px-4 lg:px-5 gap-3">
            <div 
                className="absolute inset-0 opacity-50 z-0" 
                style={getBackgroundStyle()}
            />
            <div className="relative z-10 flex flex-row items-center w-full gap-3">
                <PlayerCard 
                    profilePhoto={ProfilePhoto1} 
                    playerName={Player1}
                    level={level1} 
                    score={Score1} 
                    reverse={false}
                    isHighScore={Score1 > Score2}
                />
                <div className="w-[10%] h-full flex items-center justify-center">
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
        </div>
    );
};

export default MatchHistoryComponent;