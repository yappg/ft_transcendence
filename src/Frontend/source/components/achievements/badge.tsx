/* eslint-disable @next/next/no-img-element */
import React from 'react';

const AchievementBadge = ({
  title = 'First Achievement',
  description = 'play first game and win with',
  points = 10,
  progress = 75,
  xpReward = 1000,
  iconUrl = '/api/placeholder/80/80',
}) => {
  return (
    <div className="relative flex h-[132px] w-[423px] items-center rounded-3xl bg-gray-500 p-4">
      {/* Icon Container */}
      <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-500">
        <img src={iconUrl} alt="Icon" className="size-16 object-cover" />
      </div>

      {/* Content Container */}
      <div className="ml-4 grow">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold italic text-white">{title}</h2>
          <span className="font-bold text-blue-400">+{xpReward} xp</span>
        </div>

        {/* Description */}
        <div className="mb-2 text-gray-300">
          {description} {points} points
        </div>

        {/* Progress Bar */}
        <div className="h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;
