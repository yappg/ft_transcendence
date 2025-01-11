/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import FriendsComponent from "@/components/friends/FriendsComponent";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext, useEffect } from "react";
import { useUser } from "@/context/GlobalContext";
import { userService } from "@/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);

  useEffect(() => {
    setIsActivated(4);
  }, []);

  const { PlayerLeaderBoard, setPlayerLeaderBoard, setIsLoading } = useUser();

  useEffect(() => {
    const fetchPlayerLeaderBoard = async () => {
      setIsLoading(true);
      try {
        const fetchPlayerLeaderBoard = await userService.getPlayerLeaderBoard();
        setPlayerLeaderBoard(fetchPlayerLeaderBoard);
      } catch (err) {
        setPlayerLeaderBoard(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayerLeaderBoard();
  }, [setPlayerLeaderBoard, setIsLoading]);

  if (!PlayerLeaderBoard)
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
    <div className="size-full overflow-auto md:py-4 md:pl-6">
      <div className="costum-little-shadow size-full overflow-hidden bg-[#00000099] md:w-full md:rounded-[50px]">
        <div className="flex size-full w-full flex-col items-start justify-start">
          <div className="size-full">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
              <div className="h-fit w-full bg-black-crd dark:bg-transparent">
                <FriendsComponent
                  name={PlayerLeaderBoard[0].display_name}
                  ProfilePhoto={
                    process.env.NEXT_PUBLIC_HOST + PlayerLeaderBoard[0].avatar
                  }
                  level={PlayerLeaderBoard[0].level}
                  wins={PlayerLeaderBoard[0].games_won}
                  losses={PlayerLeaderBoard[0].games_loss}
                  messagesLink={
                    <div className="flex h-[100px] w-[90%] items-center justify-center rounded-l-full bg-[#FFFF00] bg-opacity-[40%] sm:h-[100px] sm:w-full lg:h-[150px] lg:w-[90%]">
                      <span className="font-dayson text-[15px] text-[#FFFF00] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                        1st
                      </span>
                    </div>
                  }
                  customStyles={{ backgroundColor: "rgba(255, 255, 0, 0.3)" }}
                  achievements={PlayerLeaderBoard[0].Achievement}
                  id={PlayerLeaderBoard[0].id}
                />
                {PlayerLeaderBoard.length > 1 && (
                  <FriendsComponent
                    name={PlayerLeaderBoard[1].display_name}
                    ProfilePhoto={
                      process.env.NEXT_PUBLIC_HOST + PlayerLeaderBoard[1].avatar
                    }
                    level={PlayerLeaderBoard[1].level}
                    wins={PlayerLeaderBoard[1].games_won}
                    losses={PlayerLeaderBoard[1].games_loss}
                    messagesLink={
                      <div className="flex h-[100px] w-[65%] items-center justify-center rounded-l-full bg-[#C0C0C0] bg-opacity-[50%] sm:h-[100px] sm:w-3/4 lg:h-[150px]">
                        <span className="font-dayson text-[15px] text-[#C0C0C0] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                          2nd
                        </span>
                      </div>
                    }
                    customStyles={{
                      backgroundColor: "rgba(192, 192, 192, 0.3)",
                    }}
                    achievements={PlayerLeaderBoard[1].Achievement}
                    id={PlayerLeaderBoard[1].id}
                  />
                )}
                {PlayerLeaderBoard.length > 2 && (
                  <FriendsComponent
                    name={PlayerLeaderBoard[2].display_name}
                    ProfilePhoto={
                      process.env.NEXT_PUBLIC_HOST + PlayerLeaderBoard[2].avatar
                    }
                    level={PlayerLeaderBoard[2].level}
                    wins={PlayerLeaderBoard[2].games_won}
                    losses={PlayerLeaderBoard[2].games_loss}
                    messagesLink={
                      <div className="flex h-[100px] w-3/5 items-center justify-center rounded-l-full bg-[#CD7F32] bg-opacity-[50%] sm:h-[100px] sm:w-3/5 lg:h-[150px] lg:w-3/5">
                        <span className="font-dayson text-[15px] text-[#CD7F32] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                          3rd
                        </span>
                      </div>
                    }
                    customStyles={{
                      backgroundColor: "rgba(205, 127, 50, 0.3)",
                    }}
                    achievements={PlayerLeaderBoard[2].Achievement}
                    id={PlayerLeaderBoard[2].id}
                  />
                )}
              </div>
              {/* there is a problem here  duplicate the first 3 players */}
              {PlayerLeaderBoard.filter((friend, index) => index >= 3).map(
                (friend, index) => (
                  <FriendsComponent
                    key={index}
                    name={friend.display_name}
                    ProfilePhoto={process.env.NEXT_PUBLIC_HOST + friend.avatar}
                    level={friend.level}
                    wins={friend.games_won}
                    losses={friend.games_loss}
                    messagesLink={
                      <div className="flex h-[70px] w-[100px] items-center justify-center rounded-full sm:h-[70px] lg:h-[150px] lg:w-[200px]">
                        <span className="font-dayson text-[15px] text-white sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[40px]">
                          {index + 4}
                        </span>
                      </div>
                    }
                    customStyles={{ backgroundColor: "" }}
                    achievements={friend.Achievement}
                    id={friend.id}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
