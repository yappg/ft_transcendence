'use client';
import UserFriendsNav from '@/components/friends/UserFriendsNav';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(6);
  });
  return (
    <div className="lg:col-span-10 lg:col-start-2 col-span-full col-start-1 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] lg:py-4 lg:pl-6 bg-black">
      <div className="costum-little-shadow size-full overflow-hidden lg:rounded-[50px]">
        <UserFriendsNav />
      </div>
    </div>
  );
}
