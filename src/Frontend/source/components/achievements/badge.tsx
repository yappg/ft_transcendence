/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Achievement } from '@/constants/achivemement';

const AchievementBadge: React.FC<Achievement> = ({
  title,
  description,
  points,
  progress,
  xpReward,
  iconUrl,
}) => {
  return (
    <div className="relative flex h-[150px] w-full items-center rounded-3xl bg-[#FFFF00] bg-opacity-[40%] p-4 transition-transform duration-300 hover:scale-105 gap-5 border border-blue-500">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-500">
        <img 
          src={iconUrl} 
          alt="Achievement Icon" 
          className="size-full object-cover" 
          aria-label={title} 
        />
      </div>

      <div className="ml-4 grow">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold italic text-blue-500">{title}</h2>
          <span className="font-bold text-blue-400">+{xpReward} xp</span>
        </div>

        <div className="mb-2 text-gray-700">
          {description} {points} points
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;
