'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { useAuth } from '@/context/AuthContext';
import { SideBarContext } from '@/context/SideBarContext';
import withAuth from '@/context/requireAhuth';
import { usePathname } from 'next/navigation';
import { ComponentType, useContext } from 'react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, updateUser } = useAuth();
  const { isActivated, setIsActivated } = useContext(SideBarContext);
  const handleRightClick = (id: number) => {
    setIsActivated(id);
  };
  // const usename = localStorage.getItem('user');
  // const otp_enabled = localStorage.getItem('otp-enabled');
  // const otp_validated = localStorage.getItem('otp-validated');

  // updateUser({
  //   username: usename && usename !== '' ? usename : '',
  //   is2FAEnabled: otp_enabled === 'True',
  //   is2FAvalidated: otp_validated === 'True',
  // });

  return (
    <div className="grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px] overflow-auto bg-linear-gradient lg:p-8 pt-8 dark:bg-linear-gradient-dark">
      <div className="row-[span_9_/_span_9] min-h-0 grow items-start justify-center hidden lg:flex">
        <SideBar pathname={pathname} handleRightClick={handleRightClick} />
      </div>
      <div className="lg:col-span-10 lg:col-start-2 col-span-full col-start-1 row-start-1 flex items-start justify-start pt-2 transition-all duration-300">
        <Header />
      </div>
      <div
        className={`${
          isActivated === 7 ||
          isActivated === 8 ||
          isActivated === 4 ||
          isActivated === 6 ||
          isActivated === 9 ||
          pathname === '/friends' ||
          pathname === '/LeaderBoard' ||
          pathname === '/Profile' ||
          pathname === '/MatchHistory' ||
          pathname === '/messages' ||
          pathname === '/settings'
            ? 'hidden'
            : 'flex'
        } col-start-12 row-[span_9_/_span_9] row-start-1 items-start justify-center transition-all duration-300 `}
      >
        <RightBar handleRightClick={handleRightClick} />
      </div>
      {children}
    </div>
  );
}

export default withAuth(RootLayout as ComponentType<{}>, true);
