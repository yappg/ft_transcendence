'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isActivated, setIsActivated] = useState(0);
  const [showSideBarIcon, setShowSideBarIcon] = useState(true);
  useEffect(() => {
    if (pathname === '/friends' || pathname === '/messages') {
      setShowSideBarIcon(true);
    } else {
      setShowSideBarIcon(false);
    }
  }, [pathname]);

  const handleRightClick = (id: number) => {
    setIsActivated(id);
    if (
      pathname === '/friends' ||
      pathname === '/messages' ||
      id === 6 ||
      id === 7
    ) {
      setShowSideBarIcon(true);
    } else {
      setShowSideBarIcon(false);
    }
  };

  return (
    <div className="bg-white h-[100vh] w-[100vw] overflow-auto grid p-8 grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px]">
      <div className="row-[span_9_/_span_9] flex items-center justify-center min-h-0 flex-grow">
        <SideBar
          isActivated={isActivated}
          setIsActivated={setIsActivated}
          ShowSideBarIcon={showSideBarIcon}
          handleRightClick={handleRightClick}
          setShowSideBarIcon={setShowSideBarIcon}
        />
      </div>
      <div className="col-span-10 col-start-2 row-start-1 flex items-center justify-start transition-all duration-300 ">
        <Header />
      </div>
      <div
        className={`${isActivated === 7 || isActivated === 6 || pathname === '/friends' || pathname === '/messages' ? 'hidden' : 'flex'} row-[span_9_/_span_9] col-start-12 row-start-1 items-center justify-center transition-all duration-300`}
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
