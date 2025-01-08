/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { History } from "@/context/GlobalContext";
import MatchHistoryComponent from "@/components/MatchHistory/HistoryComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect } from "react";
import { SideBarContext } from "@/context/SideBarContext";
import { useUser } from "@/context/GlobalContext";
import { userService } from "@/services/userService";

export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);

  useEffect(() => {
    setIsActivated(5);
  }, []);

  const { PlayerMatches, setIsLoading, setPlayerMatches } = useUser();

  const fetchPlayerMatches = async () => {
    setIsLoading(true);
    try {
      const fetchedMatches = await userService.getPlayerMatches();
      setPlayerMatches(fetchedMatches);
    } catch (err) {
      setPlayerMatches(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerMatches();
  }, []);

  if (!PlayerMatches)
    return (
      <div className="ml-5 flex size-full flex-col items-center justify-center gap-2 overflow-hidden rounded-[50px] bg-black-crd">
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
        <Skeleton className="size-full bg-black-crd md:h-[100px] md:w-full lg:h-[150px]" />
      </div>
    );
  return (
    <div className="flex size-full flex-col items-center justify-center">
      {PlayerMatches?.length === 0 && (
        <div className="flex size-full items-center justify-center">
          <h1 className="font-dayson text-2xl font-bold text-white">
            No Matches Found
          </h1>
        </div>
      )}
      <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll bg-[#00000099] md:rounded-[50px]">
        {PlayerMatches?.map((match: History) => (
          <MatchHistoryComponent
            key={match.id}
            Player1={match.player1.display_name}
            Player2={match.player2.display_name}
            ProfilePhoto1={match.player1.avatar}
            ProfilePhoto2={match.player2.avatar}
            level1={match.player1.level}
            level2={match.player2.level}
            Score1={match.player1_score}
            Score2={match.player2_score}
            map_played={match.map_played}
          />
        ))}
      </div>
    </div>
  );
}
