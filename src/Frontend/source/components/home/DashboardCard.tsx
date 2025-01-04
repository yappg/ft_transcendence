import { useUser } from '@/context/GlobalContext';
import { RiArrowRightSLine } from "react-icons/ri";
export const DashboardCard = (...props: any) => {
    const { user } = useUser();
    if (!user) {
        return <div className="w-full h-full rounded-[30px]">
            <h1 className="text-white text-2xl font-dayson font-bold">No data available</h1>
        </div>
    }
    const {PlayerMatches} = useUser();  
    console.log('PlayerMatches', PlayerMatches[0]);
    return (
        <>
            {PlayerMatches && PlayerMatches.length > 0 ? (
                <div className={`w-full h-full rounded-[30px] relative`}>
                    <div className={`absolute inset-0 rounded-[30px] bg-cover bg-center
                        ${PlayerMatches[0]?.map_played === 'water' ? 'bg-[url("/WaterMode.svg")]' : 
                        PlayerMatches[0]?.map_played === 'air' ? 'bg-[url("/AirMode.svg")]' : 
                        PlayerMatches[0]?.map_played === 'earth' ? 'bg-[url("/EarthMode.svg")]' : 
                        PlayerMatches[0]?.map_played === 'fire' ? 'bg-[url("/FireMode.svg")]' : 
                        ''}`}>
                    </div>
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="relative flex items-center p-1 px-5 justify-between w-full h-full">
                        <img 
                            src={PlayerMatches[0]?.player1.avatar} 
                            alt="avatar" 
                            className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] rounded-full object-cover"
                        />
                        <div className="flex flex-col items-start justify-center gap-2">
                            <h1 className="text-white text-sm font-dayson">
                                {PlayerMatches[0]?.player1.display_name.slice(0, 7)}
                            </h1>
                            <h1 className="text-green-500 text-sm font-dayson">
                                {PlayerMatches[0]?.player1_score}
                            </h1>
                        </div>
                        <h1 className="text-white xl:text-[45px] text-[30px] font-coustard">VS</h1>
                        <div className="flex flex-col items-end justify-end gap-2">
                            <h1 className="text-white text-sm font-dayson">
                                {PlayerMatches[0]?.player2.display_name.slice(0, 7)}
                            </h1>
                            <h1 className="text-red-500 text-sm font-dayson">
                                {PlayerMatches[0]?.player2_score}
                            </h1>
                        </div>
                        <img 
                            src={PlayerMatches[0]?.player2.avatar} 
                            alt="avatar" 
                            className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] rounded-full object-cover"
                        />
                        <RiArrowRightSLine className="text-white sm:text-[80px] lg:text-[50px] font-dayson font-bold" />
                    </div>
                </div>
            ) : (
                <div className="w-full h-full rounded-[30px] bg-black-crd flex items-center justify-center p-4">
                    <h1 className="text-white text-lg font-dayson">No matches found</h1>
                </div>
            )}
        </>
    );
}
