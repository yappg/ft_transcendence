'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { SideBarContext } from '@/context/SideBarContext';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isActivated, setIsActivated } = useContext(SideBarContext);
  const handleRightClick = (id: number) => {
    setIsActivated(id);
    console.log('id', id);
  };
  return (
    <div className=" bg-linear-gradient dark:bg-linear-gradient-dark grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px] overflow-auto p-8">
      <div className="row-[span_9_/_span_9] flex min-h-0 grow items-center justify-center">
        <SideBar pathname={pathname} handleRightClick={handleRightClick} />
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
        <RightBar handleRightClick={handleRightClick} />
      </div>
      {children}
    </div>
  );
}
