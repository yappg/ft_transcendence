'use client';
import FriendsComponent from '@/components/friends/FriendsComponent';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext, useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(4);
  }, []);
  const {PlayerLeaderBoard} = useUser();
  console.log('this is the fetched leaderboard2: ', PlayerLeaderBoard);
  if(!PlayerLeaderBoard)
    return <div className="size-full md:py-4 md:pl-6 flex items-center justify-center">
      <h1 className="font-dayson font-bold text-[40px]"> No User</h1>
    </div>
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full md:rounded-[50px] md:w-full overflow-hidden bg-[#00000099]">
        <div className="flex size-full w-full flex-col items-start justify-start">
          <div className="h-[100%] w-full ">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
              <div className="bg-black-crd dark:bg-transparent w-full h-fit">
                <FriendsComponent
                  name={PlayerLeaderBoard[0].display_name}
                  ProfilePhoto={PlayerLeaderBoard[0].avatar}
                  level={PlayerLeaderBoard[0].level}
                  wins={PlayerLeaderBoard[0].games_won}
                  losses={PlayerLeaderBoard[0].games_loss}
                  messagesLink={
                    <div className="flex lg:h-[150px] sm:h-[70px] h-[70px] lg:w-[90%] sm:w-[100%] w-[90%] items-center justify-center bg-[#FFFF00] bg-opacity-[40%] rounded-l-full">
                      <span className="text-[#FFFF00] font-dayson 2xl:text-[50px] xl:text-[42px] md:text-[30px] sm:text-[22px] text-[15px]">
                        1st
                      </span>
                    </div>
                  }
                  customStyles={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}
                />
                {
                  PlayerLeaderBoard.length > 1 &&
                <FriendsComponent
                  name={PlayerLeaderBoard[1].display_name}
                  ProfilePhoto={PlayerLeaderBoard[1].avatar}
                  level={PlayerLeaderBoard[1].level}
                  wins={PlayerLeaderBoard[1].games_won}
                  losses={PlayerLeaderBoard[1].games_loss}
                  messagesLink={
                    <div className="flex lg:h-[150px] sm:h-[70px] h-[70px] sm:w-[75%] w-[65%] items-center justify-center bg-[#C0C0C0] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#C0C0C0] font-dayson 2xl:text-[50px] xl:text-[42px] md:text-[30px] sm:text-[22px] text-[15px]">
                        2nd
                      </span>
                    </div>
                  }
                  customStyles={{ backgroundColor: 'rgba(192, 192, 192, 0.3)' }}
                />
                }
                {
                  PlayerLeaderBoard.length > 2 &&
                <FriendsComponent
                  name={PlayerLeaderBoard[2].display_name}
                  ProfilePhoto={PlayerLeaderBoard[2].avatar}
                  level={PlayerLeaderBoard[2].level}
                  wins={PlayerLeaderBoard[2].games_won}
                  losses={PlayerLeaderBoard[2].games_loss}
                  messagesLink={
                    <div className="flex lg:h-[150px] sm:h-[70px] h-[70px] lg:w-[60%] sm:w-[60%] w-[60%] items-center justify-center bg-[#CD7F32] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#CD7F32] font-dayson 2xl:text-[50px] xl:text-[42px] md:text-[30px] sm:text-[22px] text-[15px]">
                        3rd
                      </span>
                    </div>
                  }
                  customStyles={{ backgroundColor: 'rgba(205, 127, 50, 0.3)' }}
                />
                }
              </div>
              
               {PlayerLeaderBoard.filter((val: { id: number }) => val.id >= 4).map((friend, index) => (
                <FriendsComponent
                  key={index + 4}
                  name={friend.display_name}
                  ProfilePhoto={friend.avatar}
                  level={friend.level}
                  wins={friend.games_won}
                  losses={friend.games_loss}
                  messagesLink={
                    <div className="flex lg:h-[150px] sm:h-[70px] h-[70px] lg:w-[200px] w-[100px] items-center justify-center rounded-full">
                      <span className="text-white font-dayson 2xl:text-[40px] xl:text-[42px] md:text-[30px] sm:text-[22px] text-[15px]">
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
