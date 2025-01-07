"use client";
import { History } from "@/context/GlobalContext";
import MatchHistoryComponent from "@/components/MatchHistory/HistoryComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect } from "react";
import { SideBarContext } from "@/context/SideBarContext";
import { useUser } from "@/context/GlobalContext";
import { userService } from "@/services/userService";
/* eslint-disable react-hooks/exhaustive-deps */
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
      <div className="flex size-full flex-col items-center justify-center gap-2 bg-black-crd rounded-[50px] overflow-hidden ml-5">
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
        <Skeleton className="size-full md:w-full md:h-[100px] lg:h-[150px] bg-black-crd" />
      </div>
    );
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll bg-[#00000099] md:rounded-[50px]">
        {PlayerMatches?.length === 0 && (
          <div className="flex size-full items-center justify-center">
            <h1 className="font-dayson text-2xl font-bold text-white">
              No Matches Found
            </h1>
          </div>
        )}
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
