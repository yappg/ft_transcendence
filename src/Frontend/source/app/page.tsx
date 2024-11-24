/* eslint-disable tailwindcss/no-custom-classname */
import Background from '@/components/landing-page/Background';
import React from 'react';

export default function Home() {
  return (
    <div className="dark:bg-secondary relative z-[1] h-screen w-full overflow-hidden bg-white">
      <Background />
    </div>
  );
}
