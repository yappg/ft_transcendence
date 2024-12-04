import FriendsComponent from "@/components/friends/FriendsComponent"
import { LeaderBoard } from "@/constants/LeaderBoard"
import { FaCommentDots } from "react-icons/fa"
import Link from "next/link"
export default function Page() {
    const num = ["st", "nd", "rd"];
    return (
        <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6 ">
            <div className="costum-little-shadow h-full w-[95%] overflow-hidden rounded-[50px] md:w-full">
                    <div className="flex size-full w-full flex-col items-start justify-start">
                        <div className="h-[100%] w-full ">
                            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
                            <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[0].name}
                                  ProfilePhoto={LeaderBoard[0].profilePhoto}
                                  level={LeaderBoard[0].level}
                                  wins={LeaderBoard[0].wins}
                                  messagesLink={
                                    <div className="-mr-[20px] flex h-[150px] w-[300px] items-center justify-center bg-[#FFFF00] bg-opacity-[40%] rounded-l-full">
                      <span className="text-[#FFFF00] font-dayson text-[50px]">1st</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(52, 106, 10, 0.6)' }}
                                />
                                <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[0].name}
                                  ProfilePhoto={LeaderBoard[0].profilePhoto}
                                  level={LeaderBoard[0].level}
                                  wins={LeaderBoard[0].wins}
                                  messagesLink={
                                    <div className="-mr-[20px] flex h-[150px] w-[250px] items-center justify-center bg-[#C0C0C0] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#C0C0C0] font-dayson text-[50px]">2nd</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                                />
                                <FriendsComponent
                                  index={1}
                                  name={LeaderBoard[0].name}
                                  ProfilePhoto={LeaderBoard[0].profilePhoto}
                                  level={LeaderBoard[0].level}
                                  wins={LeaderBoard[0].wins}
                                  messagesLink={
                                    <div className="-mr-[20px] flex h-[150px] w-[200px] items-center justify-center bg-[#CD7F32] bg-opacity-[50%] rounded-l-full">
                      <span className="text-[#CD7F32] font-dayson text-[50px]">3rd</span>
                    </div>
                                  }
                                  customStyles={{ backgroundColor: 'rgba(205, 127, 50, 0.3)' }}
                                />
                                {LeaderBoard.map((friend, index) => (
                                <FriendsComponent
                                  key={index + 4}
                                  index={index + 4}
                                  name={friend.name}
                                  ProfilePhoto={friend.profilePhoto}
                                  level={friend.level}
                                  wins={friend.wins}
                                  messagesLink={
                                    <div className="flex h-[150px] w-[200px] items-center justify-center  rounded-full">
                      <span className="text-white font-dayson text-[40px]">{index + 4}</span>
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
