'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserActivityBoard from './UserActivityBoard';
import { MatchHistory } from '@/constants/MatchHistory';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FriendServices from '@/services/friendServices';
import { toast } from '@/hooks/use-toast';
import MatchHistoryBoard from './MatchHistoryBoard';
import { Chart } from "@/components/Profile/Chart";
import { ChartLine } from '@/components/Profile/ChartLine';
import Rating from './rating';
import { useUser } from '@/context/GlobalContext';
const UserSummary = (): JSX.Element => {
  const { user: userProfile } = useUser();
  if (!userProfile) return <div>Loading...</div>; 
  const {total_games, achievements } = userProfile;
  // const {players} = useUser();
  const {PlayerMatches} = useUser();
  return (
    <div className="size-full bg-[#242627]/90 shadow-[0px_-28px_17px_0px_rgba(36,_38,_39,_1)] overflow-y-scroll custom-scrollbar-container xl:overflow-y-hidden flex 2xl:px-8 px-4 xl:flex-row xl:gap-0 flex-col gap-12 pb-5">
      <div className="w-full h-screen lg:size-full xl:w-[65%] flex items-start justify-start flex-col gap-2">
        <div className="w-full lg:h-[20%] h-[10%] flex flex-row gap-3 overflow-hidden p-5 xl:p-2 ">
          {achievements.map((achievement, index) => (
            <Avatar
              key={index}
              className="lg:size-[65px] transition-all duration-300 xl:size-[80px] sm:size-[70px] size-[50px] bg-[#00A6FF]"
            >
              <AvatarImage src={"http://localhost:8080" + achievement.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="lg:h-[80%] size-full flex items-center justify-between xl:px-5 lg:flex-row flex-col gap-8 overflow-y-scroll custom-scrollbar-container">
          <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll lg:w-[48%] size-full bg-[#4C4D4E] rounded-[50px] shadow-2xl">
            {PlayerMatches.map((user, index) => (
              <MatchHistoryBoard
                key={index}
                name={user.player2.display_name}
                Profile={user.player2.avatar}
                Player1score={user.player1_score || 0}
                Player2score={user.player2_Score || 0}
              />
            ))}
            <Link href="/MatchHistory">
              <div className="w-full sticky bottom-0 bg-[#4C4D4E] z-10 h-[50px] border-t-2 border-[#B8B8B8] flex items-center justify-end gap-4 px-10">
                <h1 className="2xl:text-[20px] lg:text-[15px] font-dayson text-[#B8B8B8]">
                  Match History
                </h1>
                <h1 className="2xl:text-[25px] lg:text-[20px] font-dayson text-[#B8B8B8]">{'>'}</h1>
              </div>
            </Link>
          </div>
          <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll lg:w-[48%] size-full bg-[#4C4D4E] rounded-[50px] shadow-2xl flex flex-col">
            {/* <div className="flex-grow">
              {players.length > 0 ? (
                players.map((user, index) => (
                <UserActivityBoard
                  key={index}
                  name={user.name}
                  level={user.level}
                  Profile={user.ProfilePhoto}
                />
              ))
              ) : (
                <div className="text-center font-bold text-white h-full flex items-center justify-center bg-black-crd">No Friends to display </div>
              )}
            </div> */}

            <Link href="/friends">
              <div className="w-full sticky bottom-0 bg-[#4C4D4E] z-10 h-[50px] border-t-2 border-[#B8B8B8] flex items-center justify-end gap-4 px-10">
                <h1 className="2xl:text-[20px] lg:text-[15px] font-dayson text-[#B8B8B8]">
                   Friends
                </h1>
                <h1 className="2xl:text-[25px] lg:text-[20px] font-dayson text-[#B8B8B8]">{'>'}</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="size-full xl:w-[35%] xl:h-[97%] flex items-center justify-center rounded-[50px] bg-[#4C4D4E] flex-row md:flex-col  gap-7 xl:m-4 xl:p-4">
        <div className="w-full h-2/5 xl:w-full xl:h-[45%] flex items-center justify-between pt-7">
          <Chart total_games={total_games} statistics={userProfile?.statistics} />
          <Rating />
        </div>
        <div className="xl:w-[90%] w-full h-3/5 flex items-start justify-start overflow-hidden">
          <ChartLine statistics={userProfile?.statistics} />
        </div>
      </div>
    </div>
  );
};
export default UserSummary;
