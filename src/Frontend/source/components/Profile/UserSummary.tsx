/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Chart } from "@/components/Profile/Chart";
import { ChartLine } from "@/components/Profile/ChartLine";
import Rating from "./rating";
import { Player, User, History } from "@/context/GlobalContext";
import { Achievments } from "./Achievments";
import { JSX } from "react";
import { MatchHistory } from "./MatchHistory";
import { Friends } from "./Friends";
import { Skeleton } from "../ui/skeleton";

const UserSummary = ({
  user,
  is_private,
}: {
  user: User;
  userFriends: Player[];
  userHistory: History[];
  is_private: boolean;
}): JSX.Element => {
  if (!user) return <Skeleton className="size-full rounded-md bg-black-crd" />;
  const { total_games, achievements } = user;
  if (is_private) {
    return (
      <div className="flex size-full items-center justify-center text-black-crd dark:text-white-crd">
        This profile is private
      </div>
    );
  } else {
    return (
      <div className="flex h-fit w-full flex-col items-center overflow-x-hidden overflow-y-scroll bg-[#242627]/90 scrollbar-hide lg:h-full lg:flex-row">
        <div className="z-50 flex h-fit w-full flex-col items-center justify-center gap-2 lg:h-full lg:w-[63%]">
          <Achievments achievements={achievements} />
          <div className="flex h-fit w-full flex-col items-center justify-start gap-9 lg:h-full lg:flex-row lg:px-7 xl:py-5 2xl:gap-12 2xl:py-10">
            <MatchHistory PlayerMatches={user.matches_history} />
            <Friends players={user.friends} />
          </div>
        </div>
        <div className="z-50 m-8 flex size-full flex-col items-center justify-center gap-10 rounded-[14px] bg-[#4C4D4E] shadow-2xl md:gap-2 lg:h-[90%] lg:w-[37%] lg:rounded-[30px]">
          <div className="flex h-1/2 w-full flex-col items-center justify-center gap-20 sm:gap-2 xl:flex-row">
            <div className="h-1/2 w-full sm:h-full sm:w-1/2">
              <Chart total_games={total_games} stats={user?.statistics} />
            </div>
            <Rating statistics={user?.statistics} />
          </div>
          <div className="flex h-1/2 w-full items-center justify-center">
            <ChartLine statistics={user?.statistics} />
          </div>
        </div>
      </div>
    );
  }
};

export default UserSummary;
