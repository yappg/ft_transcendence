/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  points: number;
  progress: number;
  xpReward: number;
  iconUrl: string;
}

const AchievementBadge = ({
  title,
  description,
  points,
  progress,
  xpReward,
  iconUrl,
}: AchievementBadgeProps) => {
  return (
    <div className="costum-little-shadow relative flex h-[150px] w-full items-center rounded-3xl bg-black-crd p-4">
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
