import FriendsComponent from "@/components/friends/FriendsComponent"
import { LeaderBoard } from "@/constants/LeaderBoard"
export default function Page() {
    return (
        <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6 ">
            <div className="costum-little-shadow h-full w-[95%] overflow-hidden rounded-[50px] md:w-full">
                    <div className="flex size-full w-full flex-col items-start justify-start">
                        <div className="h-[100%] w-full ">
                            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
                              <div className="bg-black-crd dark:bg-transparent w-full h-fit">

                            <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[0].name}
                                  ProfilePhoto={LeaderBoard[0].profilePhoto}
                                  level={LeaderBoard[0].level}
                                  wins={LeaderBoard[0].wins}
                                  messagesLink={
                                    <div className="flex h-[150px] lg:w-[90%] md:w-[80%] items-center justify-center bg-[#FFFF00] bg-opacity-[40%] rounded-l-full">
                      <span className="text-[#FFFF00] font-dayson 2xl:text-[50px] xl:text-[42px] text-[36px]">1st</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(255, 255, 0, 0.3)' }}
                                />
                                <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[1].name}
                                  ProfilePhoto={LeaderBoard[1].profilePhoto}
                                  level={LeaderBoard[1].level}
                                  wins={LeaderBoard[1].wins}
                                  messagesLink={
                                    <div className="flex h-[150px] lg:w-[75%] md:w-[70%] items-center justify-center bg-[#C0C0C0] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#C0C0C0] font-dayson 2xl:text-[50px] xl:text-[42px] text-[36px]">2nd</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(192, 192, 192, 0.3)' }}
                                />
                                <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[2].name}
                                  ProfilePhoto={LeaderBoard[2].profilePhoto}
                                  level={LeaderBoard[2].level}
                                  wins={LeaderBoard[2].wins}
                                  messagesLink={
                                    <div className="flex h-[150px] lg:w-[60%] md:w-[50%] items-center justify-center bg-[#CD7F32] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#CD7F32] font-dayson 2xl:text-[50px] xl:text-[42px] text-[36px]">3rd</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(205, 127, 50, 0.3)' }}
                                />
                              </div>
                                {LeaderBoard.map((friend, index) => (
                                <FriendsComponent
                                  key={index + 4}
                                  index={index + 4}
                                  name={friend.name}
                                  ProfilePhoto={friend.profilePhoto}
                                  level={friend.level}
                                  wins={friend.wins}
                                  messagesLink={
                                    <div className="flex h-[150px] lg:w-[200px] w-[100px] items-center justify-center  rounded-full">
                      <span className="text-white font-dayson 2xl:text-[40px] xl:text-[42px] text-[36px]">{index + 4}</span>
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
    )
};
