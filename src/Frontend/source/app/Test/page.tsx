import React from 'react';
import AchievementBadge from '@/components/achievements/badge';
import EarthModeCard from '@/components/game/theme-card';

function achievements() {
  return (
    <div className="flex h-screen w-full gap-10 bg-white p-10">
      <AchievementBadge
        title="Water killer"
        description="kill ball in water "
        iconUrl="/logo.svg"
        key={1}
        points={10}
        progress={10}
        xpReward={20}
      />
      <EarthModeCard
        description="hello lorem ipsum ipsum lorem"
        title="Earth"
        imageUrl="/image.png"
        height="70"
      />
    </div>
  );
}

export default achievements;
