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
    console.log('Clicked on ID:', id);
    setIsActivated(id);                                                                                              
  };

  return (
    <UserProvider>
      <div className="grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] gap-[8px] overflow-auto bg-linear-gradient sm:p-8 dark:bg-linear-gradient-dark">
        <div className="row-[span_9_/_span_9] flex min-h-0 grow items-start justify-center">
          <SideBar pathname={pathname} handleRightClick={handleRightClick} />
        </div>
        <div className="md:col-span-10 md:col-start-2 col-start-0 col-span-full row-start-1 flex items-start justify-start pt-2 transition-all duration-300 border-2">
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
            : 'lg:flex hidden'
        } col-start-12 row-[span_9_/_span_9] row-start-1 items-start justify-center transition-all duration-300`}
      >
        <RightBar handleRightClick={handleRightClick} />
      </div>

      <div className="md:col-span-10 md:col-start-2 col-start-0 col-span-full row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr]">
        {children}
      </div>
    </div>
    </UserProvider>
  );
}

// to be reviewed
function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}

export default withAuth(RootLayout as ComponentType<{}>, true);
