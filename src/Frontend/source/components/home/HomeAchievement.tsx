/* eslint-disable @next/next/no-img-element */
import React from 'react';

const HomeAchievement = ({
  title = 'First Achievement',
  description = 'play first game and win with',
  points = 10,
  progress = 0.75,
  xpReward = 1000,
  ratio = 1,
  iconUrl = '/api/placeholder/80/80',
}: {
  title: string;
  description: string;
  points: number;
  progress: number;
  xpReward: number;
  ratio: number;
  iconUrl: string;
}) => {
  return (
    <div className="relative flex items-center">
      <div className="flex 2xl:size-20 lg:size-[50px] shrink-0 items-center justify-center rounded-full overflow-hidden bg-black-crd">
        <img src={iconUrl} alt="Icon" className="2xl:size-full size-[50px]  object-cover" />
      </div>
      <div className="ml-4 grow">
        <div className="flex items-start justify-between">
          <h2 className="2xl:text-2xl lg:text-lg font-bold italic text-white"> {title} </h2>
          <span className="font-bold text-blue-400 text-[10px]"> + {xpReward} xp</span>
        </div>
        <div className="mb-2 text-gray-300 text-[13px]">
          {description} {points} points
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progress > 0 ? 'bg-green-500' : 'bg-blue-500'}`}
            style={{ width: `${(progress / ratio) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeAchievement;
