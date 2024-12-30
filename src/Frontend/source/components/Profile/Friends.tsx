import { Player } from '@/context/GlobalContext';
import UserActivityBoard from './UserActivityBoard';

export const Friends = ({ players }: { players: Player[] }) => {
  return (
    <div className="relative w-full h-[300px] lg:h-full lg:w-[49%] bg-[#4C4D4E] overflow-hidden rounded-[14px] lg:rounded-[30px] shadow-2xl">
      <div className="w-full h-[85%] overflow-y-scroll custom-scrollbar-container">
        {!players || players?.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-white font-bold text-center">No friends</h1>
          </div>
        ) : (
          players.map((user) => (
            <UserActivityBoard
              key={user.id}
              name={user?.display_name}
              level={user?.level || 0}
              Profile={'http://localhost:8080' + user?.avatar}
            />
          ))
        )}
      </div>
      <div className="absolute bottom-0 w-full bg-[#4C4D4E] h-[15%] border-t-2 border-[#B8B8B8] flex items-center justify-end gap-4 px-10">
        <h1 className="2xl:text-[20px] lg:text-[15px] font-dayson text-[#B8B8B8]">Friends</h1>
        <h1 className="2xl:text-[25px] lg:text-[20px] font-dayson text-[#B8B8B8]">{'>'}</h1>
      </div>
    </div>
  );
};
