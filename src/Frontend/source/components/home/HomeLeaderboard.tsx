import Link from 'next/link';
import { RiArrowRightSLine } from 'react-icons/ri';
import { LeaderBoard } from '@/context/GlobalContext';

export const HomeLeaderboard = ({ playerLeaderBoard }: { playerLeaderBoard: LeaderBoard[] }) => {
  return (
    <div className="bg-black-crd flex size-full flex-col items-start justify-start rounded-[30px] py-3">
      <div className="flex h-[85%] w-full flex-col">
        {playerLeaderBoard?.slice(0, 3).map((leaderboard, index) => (
          <div
            key={index}
            className={`flex w-full flex-1 items-center justify-start gap-4 border-b-2 px-8 lg:gap-8 
                          ${index === 0 ? '' : 'flex md:hidden lg:flex'} 
                          ${index > 2 ? 'hidden' : ''}`}
          >
            <img
              src={`http://localhost:8080${leaderboard.avatar}`}
              alt="avatar"
              className="size-[40px] rounded-full object-cover lg:size-[50px]"
            />
            <div className="gap- flex flex-col items-start justify-center lg:gap-4">
              <h1 className="font-coustard text-sm text-white lg:text-[20px]">
                {leaderboard.display_name}
              </h1>
              <h1 className="font-coustard text-sm text-white opacity-50 lg:text-[20px]">
                level {leaderboard.level}
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-[15%] w-full items-center justify-end border-t border-gray-700 p-4">
        <h1 className="font-dayson text-center text-sm text-white">Leaderboard</h1>
        <Link
            href={'/LeaderBoard'}
            className="flex 2xl:size-[50px] size-[30px] items-center justify-center lg:size-[30px]"
          >
            <RiArrowRightSLine className="font-dayson 2xl:text-[40px] text-[20px] font-bold text-white lg:text-[80px]" />
          </Link>
      </div>
    </div>
  );
};
