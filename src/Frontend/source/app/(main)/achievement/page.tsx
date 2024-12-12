import React from 'react';
import AchievementBadge from '@/components/achievements/badge';

const Achievements = () => {
  const achievements = [
    {
      title: 'First Achievement',
      description: 'play first game and win with',
      points: 10,
      progress: 75,
      xpReward: 1000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
      title: 'Second Achievement',
      description: 'play second game and win with',
      points: 20,
      progress: 50,
      xpReward: 2000,
      iconUrl: '/logo.svg',
    },
    {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
      {
        title: 'Second Achievement',
        description: 'play second game and win with',
        points: 20,
        progress: 50,
        xpReward: 2000,
        iconUrl: '/logo.svg',
      },
  ];
  return (
    <div className="row-start-2 row-end-10 col-start-2 col-end-12 gap-x-3 p-2 grid grid-cols-[repeat(1,_1fr)] md:grid-cols-[repeat(2,_1fr)] lg:grid-cols-[repeat(3,_1fr)] gap-2 overflow-auto">
      {achievements.map((achievement) =>
        AchievementBadge({
          title: achievement.title,
          description: achievement.description,
          points: achievement.points,
          iconUrl: achievement.iconUrl,
          progress: achievement.progress,
          xpReward: achievement.xpReward,
        })
      )}
    </div>
  );
};

export default Achievements;
