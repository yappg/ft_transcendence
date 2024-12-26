'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Achievement } from '@/constants/achivemement'
import { useUser } from '@/context/GlobalContext';
import AchievementBadge from '@/components/achievements/badge';

const AchievementsPage: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const USER_BASE_URL = 'http://localhost:8080/accounts/';



    const userApi = axios.create({
        baseURL: USER_BASE_URL,
        withCredentials: true,
    });

    const getAchievements = async (): Promise<Achievement[]> => {
        const response = await userApi.get(`/rest-achievements/`);
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
        progress: data.progress,
        xpReward: data.achievement.xp_gain,
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
    <div className="w-full overflow-auto h-full p-4 gap-7">
      {achievements.map((achievement) => (
        <AchievementBadge 
          key={achievement.id} 
          title={achievement.title} 
          description={achievement.description} 
          points={achievement.points} 
          progress={achievement.progress} 
          xpReward={achievement.xpReward} 
          iconUrl={"http://localhost:8080" + achievement.iconUrl} 
        />
      ))}
    </div>
  );
};

export default AchievementsPage;
