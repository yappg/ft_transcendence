import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
/* eslint-disable tailwindcss/no-custom-classname */
interface PlayerCardProps {
  profilePhoto: string;
  playerName: string;
  level: number;
  score: number;
  reverse?: boolean;
  isHighScore: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  profilePhoto,
  playerName,
  level,
  score,
  reverse,
  isHighScore,
}) => {
  return (
    <div
      className={`flex h-full w-[45%] items-center p-4 lg:p-10 xl:gap-20 2xl:gap-24 ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex h-full items-center justify-center gap-6 xl:gap-10 ${
          reverse ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar className="md:size-[90px] lg:size-[80px] xl:size-[100px]">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback className="m-2 size-[80px] bg-[rgba(28,28,28,0.5)] font-dayson text-lg text-white">
            {playerName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex h-[75px] flex-col md:w-[140px] lg:w-[210px] xl:w-[250px] 2xl:w-[300px] ${
            reverse ? "items-end" : ""
          }`}
        >
          <h1 className="font-poppins text-[14px] text-white dark:text-white lg:text-[21px] xl:text-[25px] 2xl:text-[30px]">
            {playerName}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] md:text-[20px] xl:text-[25px]">
            Level {level}
          </h1>
        </div>
      </div>
      <h1
        className={`font-poppins font-bold md:text-[25px] lg:text-[25px] xl:text-[30px] 2xl:text-[45px] ${
          isHighScore ? "text-[#28AFB0]" : "text-[#E43222]"
        }`}
      >
        {score}
      </h1>
    </div>
  );
};

export default PlayerCard;
