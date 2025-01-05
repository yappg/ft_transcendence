import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
interface UserActivityBoardProps {
  name: string;
  level: number;
  Profile: string;
  scoresHistory?: string;
  scores?: number;
}
const UserActivityBoard: React.FC<UserActivityBoardProps> = ({
  name,
  level,
  Profile,
  scoresHistory,
  scores,
}) => {
  return (
    <div className="flex flex-col items-start justify-center text-white h-[80px] w-full 2xl:px-6 lg:px-4 overflow-hidden border-b-2 border-white border-opacity-[40%]">
      <div className="flex items-center justify-start 2xl:gap-20 lg:gap-6 xl:gap-8 flex-row">
        <div className="w-fit h-full flex flex-row 2xl:gap-4 lg:gap-5">
          <Avatar className="2xl:size-[60px] xl:size-[40px]">
            <AvatarImage src={Profile} />
            <AvatarFallback>OT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center 2xl:w-[200px] lg:w-[100px]">
            <p className="2xl:text-[17px] xl:text-[14px] md:text-[14px] sm:text-[18px] text-[14px]   font-dayson text-white">{name}</p>
            <p className="2xl:text-[15px] lg:text-[12px] font-coustard text-white opecity-[50%]">
              Level {level}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between 2xl:w-[100px] lg:w-[50px]">
          {scoresHistory && (
            <div
              className={`2xl:text-[23px] lg:text-[15px] font-coustard ${scoresHistory.startsWith('+') ? 'text-[#66C3BD]' : 'text-[#FF0000]'}`}
            >
              <p>{scoresHistory}</p>
            </div>
          )}
          {scores && (
            <div className="font-coustard text-white 2xl:text-[30px] lg:text-[19px]">
              <p>{scores}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityBoard;
