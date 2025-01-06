/* eslint-disable @next/next/no-img-element */
import React from "react";

const HomeAchievement = ({
  title = "First Achievement",
  description = "play first game and win with",
  points = 10,
  progress = 0.75,
  xpReward = 1000,
  ratio = 1,
  iconUrl = "/api/placeholder/80/80",
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
      <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-black-crd lg:size-[50px] 2xl:size-20">
        <img
          src={iconUrl}
          alt="Icon"
          className="size-[50px] object-cover 2xl:size-full"
        />
      </div>
      <div className="ml-4 grow">
        <div className="flex items-start justify-between">
          <h2 className="font-bold italic text-white lg:text-lg 2xl:text-2xl">
            {" "}
            {title}{" "}
          </h2>
          <span className="text-[10px] font-bold text-blue-400">
            {" "}
            + {xpReward} xp
          </span>
        </div>
        <div className="mb-2 text-[13px] text-gray-300">
          {description} {points} points
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progress > 0 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${(progress / ratio) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeAchievement;
