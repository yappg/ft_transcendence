'use client';
import UserFriendsNav from '@/components/friends/UserFriendsNav';

import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(6);
  }, [setIsActivated]);
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full overflow-hidden lg:rounded-[50px]">
        <UserFriendsNav />
      </div>
    </div>
  );
}
