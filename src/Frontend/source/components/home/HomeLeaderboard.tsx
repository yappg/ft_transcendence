import { useUser } from "@/context/GlobalContext"
import Link from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";

export const HomeLeaderboard = () => {
  const {PlayerLeaderBoard} = useUser();
  return (
      <div className="w-full h-full flex flex-col items-start justify-start rounded-[30px] bg-black-crd py-3">
          <div className="w-full h-[85%] flex flex-col">
              {PlayerLeaderBoard?.slice(0, 3).map((leaderboard, index) => (
                  <div 
                      key={index}
                      className={`w-full flex-1 flex items-center justify-start gap-4 lg:gap-8 border-b-2 px-8 
                          ${index === 0 ? '' : 'md:hidden lg:flex flex'} 
                          ${index > 2 ? 'hidden' : ''}`}
                  >
                      <img 
                          src={'http://localhost:8080' + leaderboard.avatar} 
                          alt="avatar" 
                          className="size-[40px] lg:size-[50px] rounded-full object-cover" 
                      />
                      <div className="flex flex-col items-start justify-center gap- lg:gap-4">
                          <h1 className="text-white lg:text-[20px] text-sm font-coustard">{leaderboard.display_name}</h1>
                          <h1 className="text-white lg:text-[20px] text-sm font-coustard opacity-50">level {leaderboard.level}</h1>
                      </div>
                  </div>
              ))}
          </div>
          
          <div className="w-full h-[15%] p-4 border-t border-gray-700 flex items-center justify-end">
              <h1 className="text-white text-sm font-dayson text-center">Leaderboard</h1>
              <Link href={'/leaderboard'} className='lg:size-[70px] size-[50px] flex items-center justify-center'>
                <RiArrowRightSLine className='text-white lg:text-[80px] text-[40px] font-dayson font-bold' />
              </Link>
          </div>
      </div>
  )
}