'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { UserProvider, useUser } from '@/context/GlobalContext';
import { SideBarContext } from '@/context/SideBarContext';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isActivated, setIsActivated } = useContext(SideBarContext);
  const handleRightClick = (id: number) => {
    setIsActivated(id);
  };

  return (
    <UserProvider>
      <div className=" grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] md:gap-[8px] overflow-auto bg-linear-gradient md:p-8 dark:bg-linear-gradient-dark overflow-hidden">
        <div className="row-[span_9_/_span_9] flex min-h-0 grow items-start justify-center">
          <SideBar pathname={pathname} handleRightClick={handleRightClick} />
        </div>
        <div className="col-start-0 col-span-full row-start-1 flex items-start justify-start pt-2 transition-all duration-300 md:col-span-10 md:col-start-2">
          <Header />
        </div>
        <div
          className={`${
            isActivated === 7 ||
            isActivated === 6 ||
            isActivated === 4 ||
            isActivated === 6 ||
            isActivated === 9 ||
            pathname === '/friends' ||
            pathname === '/LeaderBoard' ||
            pathname === '/Profile' ||
            pathname === '/MatchHistory' ||
            pathname === '/messages'
              ? 'hidden'
              : 'hidden lg:flex'
          } col-start-12 row-[span_9_/_span_9] row-start-1 items-start justify-center transition-all duration-300`}
        >
          <RightBar handleRightClick={handleRightClick} />
        </div>

        <div className="col-start-0 col-span-full row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] md:col-span-10 md:col-start-2">
          {children}
        </div>
      </div>
    </UserProvider>
  );
}
