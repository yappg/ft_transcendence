'use client';
import UserFriendsNav from '@/components/friends/UserFriendsNav';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
export default function Page() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(6);
  }, []);
  const player = {
    name: 'Noureddine Akebli',
    level: 22,
  };
  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6">
      <div className="costum-little-shadow h-full w-[95%] overflow-hidden rounded-[50px] md:w-full">
        <UserFriendsNav />
      </div>
    </div>
  );
}
