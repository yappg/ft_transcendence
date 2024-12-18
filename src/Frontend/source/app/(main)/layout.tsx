'use client';

import '@/app/globals.css';
import { RightBar } from '@/components/RightBar';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/header';
import { useAuth } from '@/context/AuthContext';
import { UserProvider } from '@/context/GlobalContext';
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

  return (
    <UserProvider>
      <div className="grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px] overflow-auto bg-linear-gradient p-8 dark:bg-linear-gradient-dark">
        <div className="row-[span_9_/_span_9] flex min-h-0 grow items-start justify-center">
          <SideBar pathname={pathname} handleRightClick={handleRightClick} />
        </div>
        <div className="col-span-10 col-start-2 row-start-1 flex items-start justify-start pt-2 transition-all duration-300 ">
          <Header />
        </div>
        <div
          className={`${
            isActivated === 7 ||
            isActivated === 6 ||
            isActivated === 4 ||
            isActivated === 6 ||
            pathname === '/friends' ||
            pathname === '/LeaderBoard' ||
            pathname === '/MatchHistory' ||
            pathname === '/messages'
              ? 'hidden'
              : 'flex'
          } col-start-12 row-[span_9_/_span_9] row-start-1 items-start justify-center transition-all duration-300`}
        >
          <RightBar handleRightClick={handleRightClick} />
        </div>
        {children}
      </div>
    </UserProvider>
  );
}

// to be reviewed
function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

export default withAuth(RootLayout as ComponentType<{}>, true);
