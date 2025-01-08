/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */
//

import { ModesCard } from '@/components/game/theme-card';
import React from 'react';

const test = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-gradient dark:bg-linear-gradient-dark">
      <div className="flex size-4/5">
        <ModesCard
          height="100px"
          title="One Vs One"
          description="Enter the thrilling world of one-on-one competition against another player."
          url={`/games?mode=one-vs-one`}
        />
      </div>
    </div>
  );
};

export default test;
