'use client';

import { Chart } from "@/components/Profile/Chart";
import { ChartLine } from '@/components/Profile/ChartLine';
import Rating from './rating';
import { useUser } from '@/context/GlobalContext';
import { Achievments } from './Achievments';
import { Friends } from './Friends';
import { MatchHistory } from './MatchHistory';

const UserSummary = (): JSX.Element => {
  const { user: userProfile } = useUser();
  if (!userProfile) return <div>Loading...</div>;
  const { total_games, achievements, is_private } = userProfile;
  return (
    <div className="bg-[#242627]/90 w-full h-fit lg:h-full flex lg:flex-row flex-col items-center pb-3">
      <div className="w-full h-fit lg:w-[60%] lg:h-full  flex flex-col items-start justify-start px-2 lg:px-1">
        <Achievments achievements={achievements} />
        {!is_private ? (
          <div className="w-full h-fit lg:h-full py-12 lg:px-10 flex lg:flex-row flex-col items-center justify-start gap-12">
            <MatchHistory PlayerMatches={userProfile.matches_history} />
            <Friends players={userProfile.friends} />
          </div>
        ) : (
          <div className="w-full h-fit lg:h-[calc(100%-100px)] py-2 flex lg:flex-row flex-col items-center justify-start gap-4 lg:justify-between">
            this profile is private
          </div>
        )}
      </div>
      <div className="w-full h-[600px] lg:w-[40%] lg:h-[90%] bg-[#4C4D4E] overflow-hidden rounded-[14px] lg:rounded-[30px] shadow-2xl  flex flex-col items-center justify-center m-8">
        <div className="w-full h-1/2 flex items-center justify-center">
          <div className="w-1/2  h-full">
            <Chart total_games={total_games} stats={userProfile?.statistics} />
          </div>
          <Rating statistics={userProfile?.statistics} />
        </div>
        <div className="w-full h-1/2 flex items-center justify-center">
          <ChartLine statistics={userProfile?.statistics} />
        </div>
      </div>
    </div>
  );
};
export default UserSummary;
