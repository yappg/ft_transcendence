/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
'use client';
import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Achievement } from '@/constants/achivemement';
import AchievementBadge from '@/components/achievements/badge';

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const getAchievements = async (): Promise<Achievement[]> => {
    const response = await axios.get(`/accounts/user-achievements/`);
    return response.data;
  };

  const fetchAchievements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedAchievements = await getAchievements();
      const mappedAchievements: Achievement[] = fetchedAchievements.map((data: any) => ({
        id: data.id,
        title: data.achievement.name,
        description: data.achievement.description,
        points: data.achievement.xp_gain,
        xpReward: data.achievement.xp_gain,
        ratio: data.achievement.condition,
        progress: data.progress,
        iconUrl: data.image,
        gained: data.gained,
        dateEarned: data.date_earned,
      }));
      setAchievements(mappedAchievements);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch achievements'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  if (isLoading) {
    return <div>Loading achievements...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="overflow-y-auto custom-scrollbar-container grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 flex-wrap p-4 gap-2 size-full">
      {achievements.map((achievement: Achievement, index) => (
        <AchievementBadge
          key={index}
          title={achievement.title}
          description={achievement.description}
          points={achievement.points}
          progress={achievement.progress}
          xpReward={achievement.xpReward}
          ratio={achievement.ratio}
          iconUrl={'http://localhost:8080' + achievement.iconUrl}
        />
      ))}
    </div>
  );
};

export default AchievementsPage;
