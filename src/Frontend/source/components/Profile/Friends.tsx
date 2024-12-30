import FriendsComponent from "../friends/FriendsComponent";
import UserActivityBoard from "./UserActivityBoard";

export const Friends = ({
    players,
} : {
    players: any
}) => {
    return (              <div className='relative w-full h-[300px] lg:h-full lg:w-[49%] bg-[#4C4D4E] overflow-hidden rounded-[14px] lg:rounded-[30px] shadow-2xl'>
    <div className='w-full h-[85%] overflow-y-scroll custom-scrollbar-container'>
      {
        !players || players?.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-white font-bold text-center">No friends</h1>
          </div>
        ) : ( players.map((user, index) => (
          <UserActivityBoard
            key={index}
            name={user.player?.display_name}
            Profile={user.player?.avatar}
            Player1score={user.player?.level || 0}
          />
        )))
        
      }
    </div>
    <div className="absolute bottom-0 w-full bg-[#4C4D4E] h-[15%] border-t-2 border-[#B8B8B8] flex items-center justify-end gap-4 px-10">
          <h1 className="2xl:text-[20px] lg:text-[15px] font-dayson text-[#B8B8B8]">
            Friends
          </h1>
          <h1 className="2xl:text-[25px] lg:text-[20px] font-dayson text-[#B8B8B8]">{'>'}</h1>
    </div>
  </div>);
}