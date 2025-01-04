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
} : {
  title: string,
  description: string,
  points: number,
  progress: number,
  xpReward: number,
  ratio: number,
  iconUrl: string,
}) => {

  return (
    <div className="relative flex items-center">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-full overflow-hidden bg-black-crd">
        <img src={iconUrl} alt="Icon" className="size-full object-cover" />
      </div>
      <div className="ml-4 grow">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold italic text-white"> {title} </h2>
          <span className="font-bold text-blue-400"> + {xpReward} xp</span>
        </div>
        <div className="mb-2 text-gray-300">
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