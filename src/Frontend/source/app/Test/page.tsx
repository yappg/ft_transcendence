import React from 'react';
import AchievementBadge from '@/components/achievements/badge';
import EarthModeCard from '@/components/game/theme-card';

function achievements() {
  return (
    // <div className="flex h-screen w-full gap-10 bg-white p-10">
    //   <AchievementBadge
    //     title="Water killer"
    //     description="kill ball in water "
    //     iconUrl="/logo.svg"
    //     key={1}
    //     points={10}
    //     progress={10}
    //     xpReward={20}
    //   />
    //   <EarthModeCard
    //     description="hello lorem ipsum ipsum lorem"
    //     title="Earth"
    //     imageUrl="/image.png"
    //     height="70"
    //   />
    // </div>
    <div className="costum-little-shadow font-dayson flex h-[120px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 text-white">
    <div className="flex items-start gap-4">
      <div className="flex size-[70px] items-center justify-center rounded-full bg-slate-400">
        <img
          src='/logo.svg'
          alt='avatar'
          className="rounded-full"
        />
      </div>
      <div>
        <h2>ana hada</h2>
        <h3 className="text-primary dark:text-primary-dark font-poppins">online</h3>
      </div>
    </div>
  </div>
  );
}

export default achievements;
