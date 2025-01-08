import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="flex h-[80px] w-full flex-col items-start justify-center overflow-hidden border-b-2 border-white border-opacity-[40%] text-white lg:px-4 2xl:px-6">
      <div className="flex flex-row items-center justify-start lg:gap-6 xl:gap-8 2xl:gap-20">
        <div className="flex h-full w-fit flex-row lg:gap-5 2xl:gap-4">
          <Avatar className="xl:size-[40px] 2xl:size-[60px]">
            <AvatarImage src={Profile} />
            <AvatarFallback>OT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-center lg:w-[100px] 2xl:w-[200px]">
            <p className="font-dayson text-[14px] text-white sm:text-[18px] md:text-[14px] xl:text-[14px] 2xl:text-[17px]">
              {name}
            </p>
            <p className="font-poppins text-white opacity-[50%] lg:text-[12px] 2xl:text-[15px]">
              Level {level}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between lg:w-[50px] 2xl:w-[100px]">
          {scoresHistory && (
            <div
              className={`font-poppins lg:text-[15px] 2xl:text-[23px] ${scoresHistory.startsWith("+") ? "text-[#66C3BD]" : "text-[#FF0000]"}`}
            >
              <p>{scoresHistory}</p>
            </div>
          )}
          {scores && (
            <div className="font-poppins text-white lg:text-[19px] 2xl:text-[30px]">
              <p>{scores}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityBoard;
