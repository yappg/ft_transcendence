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
    <div className="size-full lg:py-4 lg:pl-6 bg-black">
      <div className="costum-little-shadow size-full overflow-hidden lg:rounded-[50px]">
        <UserFriendsNav />
      </div>
    </div>
  );
}
