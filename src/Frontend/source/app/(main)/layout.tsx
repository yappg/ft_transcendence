'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isActivated, setIsActivated] = useState(0);

  const handleRightClick = (id: number) => {
    setIsActivated(id);
    console.log('id', id);
  };
  return (
    <div className=" bg-linear-gradient dark:bg-linear-gradient-dark grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px] overflow-auto p-8">
      <div className="row-[span_9_/_span_9] flex min-h-0 grow items-center justify-center">
        <SideBar
          isActivated={isActivated}
          setIsActivated={setIsActivated}
          pathname={pathname} // Pass pathname directly
          handleRightClick={handleRightClick}
        />
      </div>
      <div className="col-span-10 col-start-2 row-start-1 flex items-center justify-start transition-all duration-300 ">
        <Header isActivated={isActivated} />
      </div>
      <div
        className={`${
          isActivated === 7 ||
          isActivated === 6 ||
          pathname === '/friends' ||
          pathname === '/messages'
            ? 'hidden'
            : 'flex'
        } col-start-12 row-[span_9_/_span_9] row-start-1 items-center justify-center transition-all duration-300`}
      >
        <RightBar
          handleRightClick={handleRightClick}
          setIsActivated={setIsActivated}
          isActivated={isActivated}
        />
      </div>
      {children}
    </div>
  );
}
