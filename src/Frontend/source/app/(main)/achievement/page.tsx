/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Achievement } from "@/constants/achivemement";
import AchievementBadge from "@/components/achievements/badge";
import { useUser } from "@/context/GlobalContext";
import { userService } from "@/services/userService";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext } from "react";
import { Skeleton } from "@/components/ui/skeleton";
const AchievementsPage: React.FC = () => {
  const { achievements, setAchievements, setIsLoading, isLoading } = useUser();
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(3);
  }, []);
  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const fetchedAchievements = await userService.getAchievements();
      const mappedAchievements: Achievement[] = fetchedAchievements.map((data: any) => ({
        player: data.player,
        achievement: {
          name: data.achievement.name,
          description: data.achievement.description,
          xp_gain: data.achievement.xp_gain,
          condition: data.achievement.condition,
        },
        date_earned: data.date_earned,
        image: data.image,
        xpReward: data.achievement.xp_gain,
        ratio: data.achievement.condition,
        progress: data.progress,
        iconUrl: data.image,
        gained: data.gained,
        dateEarned: data.date_earned,
      }));
      setAchievements(mappedAchievements);
    } catch (err) {
      setAchievements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  if (isLoading) {
    return (
      <div className="custom-scrollbar-container grid size-full grid-cols-1 flex-wrap gap-2 overflow-y-auto p-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
        <Skeleton className="flex h-[132px] w-full items-center rounded-3xl bg-black-crd p-4" />
      </div>
    );
  }

  return (
    <div className="custom-scrollbar-container grid size-full grid-cols-1 flex-wrap gap-2 overflow-y-auto p-4 md:grid-cols-2 xl:grid-cols-3">
      {achievements &&
        achievements?.map((achievement: Achievement, index) => (
          <AchievementBadge
            key={index}
            title={achievement.achievement.name}
            description={achievement.achievement.description}
            points={achievement.achievement.condition}
            progress={achievement.progress}
            xpReward={achievement.achievement.xp_gain}
            ratio={achievement.achievement.condition}
            iconUrl={process.env.NEXT_PUBLIC_HOST + achievement.image}
          />
        ))}
    </div>
  );
};

export default AchievementsPage;
