/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import FriendsComponent from '@/components/friends/FriendsComponent';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext, useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';
import { userService } from '@/services/userService';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);

  useEffect(() => {
    setIsActivated(4);
  }, [setIsActivated]);

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

  console.log('this is the fetched leaderboard2: ', PlayerLeaderBoard);
  if (!PlayerLeaderBoard)
    return (
      <div className="flex size-full items-center justify-center md:py-4 md:pl-6">
        <h1 className="font-dayson text-[40px] font-bold"> No User</h1>
      </div>
    );
  return (
    <div className="size-full overflow-auto md:py-4 md:pl-6">
      <div className="costum-little-shadow size-full overflow-hidden bg-[#00000099] md:w-full md:rounded-[50px]">
        <div className="flex size-full w-full flex-col items-start justify-start">
          <div className="size-full ">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
              <div className="bg-black-crd h-fit w-full dark:bg-transparent">
                <FriendsComponent
                  name={PlayerLeaderBoard[0].display_name}
                  ProfilePhoto={`http://localhost:8080${PlayerLeaderBoard[0].avatar}`}
                  level={PlayerLeaderBoard[0].level}
                  wins={PlayerLeaderBoard[0].games_won}
                  losses={PlayerLeaderBoard[0].games_loss}
                  messagesLink={
                    <div className="flex h-[70px] w-[90%] items-center justify-center rounded-l-full bg-[#FFFF00] bg-opacity-[40%] sm:h-[70px] sm:w-full lg:h-[150px] lg:w-[90%]">
                      <span className="font-dayson text-[15px] text-[#FFFF00] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                        1st
                      </span>
                    </div>
                  }
                  customStyles={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}
                />
                {PlayerLeaderBoard.length > 1 && (
                  <FriendsComponent
                    name={PlayerLeaderBoard[1].display_name}
                    ProfilePhoto={`http://localhost:8080${PlayerLeaderBoard[1].avatar}`}
                    level={PlayerLeaderBoard[1].level}
                    wins={PlayerLeaderBoard[1].games_won}
                    losses={PlayerLeaderBoard[1].games_loss}
                    messagesLink={
                      <div className="flex h-[70px] w-[65%] items-center justify-center rounded-l-full bg-[#C0C0C0] bg-opacity-[50%] sm:h-[70px] sm:w-3/4 lg:h-[150px]">
                        <span className="font-dayson text-[15px] text-[#C0C0C0] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                          2nd
                        </span>
                      </div>
                    }
                    customStyles={{ backgroundColor: 'rgba(192, 192, 192, 0.3)' }}
                  />
                )}
                {PlayerLeaderBoard.length > 2 && (
                  <FriendsComponent
                    name={PlayerLeaderBoard[2].display_name}
                    ProfilePhoto={`http://localhost:8080${PlayerLeaderBoard[2].avatar}`}
                    level={PlayerLeaderBoard[2].level}
                    wins={PlayerLeaderBoard[2].games_won}
                    losses={PlayerLeaderBoard[2].games_loss}
                    messagesLink={
                      <div className="flex h-[70px] w-3/5 items-center justify-center rounded-l-full bg-[#CD7F32] bg-opacity-[50%] sm:h-[70px] sm:w-3/5 lg:h-[150px] lg:w-3/5">
                        <span className="font-dayson text-[15px] text-[#CD7F32] sm:text-[22px] md:text-[30px] xl:text-[42px] 2xl:text-[50px]">
                          3rd
                        </span>
                      </div>
                    }
                    customStyles={{ backgroundColor: 'rgba(205, 127, 50, 0.3)' }}
                  />
                )}
              </div>
              {/* there is a problem here  duplicate the first 3 players*/}
              {PlayerLeaderBoard.filter((friend, index) => index >= 3).map((friend, index) => (
                <FriendsComponent
                  key={index + 3}
                  name={friend.display_name}
                  ProfilePhoto={`http://localhost:8080${friend.avatar}`}
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
                  customStyles={{ backgroundColor: '' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
