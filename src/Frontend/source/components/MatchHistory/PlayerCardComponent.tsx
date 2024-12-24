import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PlayerCardProps {
  profilePhoto: string;
  playerName: string;
  level: number;
  score: number;
  reverse?: boolean;
  isHighScore: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ profilePhoto, playerName, level, score, reverse , isHighScore }) => {
  return (
    <div
      className={`w-[45%] h-full  flex items-center 2xl:gap-24 xl:gap-20 lg:p-10 p-4 ${
        reverse ? 'flex-row-reverse' : ''
      }`}
    >
        <div className={`h-full flex items-center justify-center xl:gap-10 gap-6  ${
        reverse ? 'flex-row-reverse' : ''
      }`}>
      <Avatar className="xl:size-[100px] lg:size-[80px] md:size-[90px]">
        <AvatarImage src={profilePhoto} />
        <AvatarFallback className="font-dayson m-2 size-[80px] bg-[rgba(28,28,28,0.5)] text-lg text-white">
          {playerName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={`flex h-[75px] 2xl:w-[300px] xl:w-[250px] lg:w-[210px] md:w-[140px] flex-col ${
        reverse ? 'items-end' : ''
      }`}>
        <h1 className="font-poppins text-[14px] text-white lg:text-[21px] xl:text-[25px] 2xl:text-[30px] dark:text-white">
          {playerName}
        </h1>
        <h1 className="font-coustard text-[12px] text-white opacity-[30%] md:text-[20px] xl:text-[25px]">
          Level {level}
        </h1>
      </div>
      </div>
      <h1 className={`font-poppins font-bold md:text-[25px] lg:text-[25px] xl:text-[30px] 2xl:text-[45px] ${
          isHighScore ? 'text-[#28AFB0]' : 'text-[#E43222]'
        }`}>
        {score}
      </h1>
    </div>
  );
};

export default PlayerCard;
