import { Player } from "@/context/GlobalContext";
import UserActivityBoard from "./UserActivityBoard";
import { Skeleton } from "../ui/skeleton";
/* eslint-disable tailwindcss/no-custom-classname */
export const Friends = ({ players }: { players: Player[] }) => {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[14px] bg-[#4C4D4E] shadow-2xl lg:h-full lg:w-1/2 lg:rounded-[30px]">
      <div className="custom-scrollbar-container h-[85%] w-full overflow-y-scroll">
        {!players ? (
          <div className="flex size-full items-center justify-center">
            <h1 className="center·font-bold·text-white">No friends</h1>
          </div>
        ) : players?.length === 0 ? (
          <div className="costum-scrollbar-container flex size-full flex-col items-center justify-center">
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            {/* <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton>
            <Skeleton className="flex h-[80px] w-full border-b-2 border-white-crd bg-black-crd"></Skeleton> */}
          </div>
        ) : (
          players.map((user) => (
            <UserActivityBoard
              key={user.id}
              name={user?.display_name}
              level={user?.level || 0}
              Profile={process.env.NEXT_PUBLIC_HOST + user?.avatar}
            />
          ))
        )}
      </div>
      <div className="absolute bottom-0 flex h-[15%] w-full items-center justify-end gap-4 border-t-2 border-[#B8B8B8] bg-[#4C4D4E] px-10">
        <h1 className="font-dayson text-[#B8B8B8] lg:text-[15px] 2xl:text-[20px]">
          Friends
        </h1>
        <h1 className="font-dayson text-[#B8B8B8] lg:text-[20px] 2xl:text-[25px]">
          {">"}
        </h1>
      </div>
    </div>
  );
};
