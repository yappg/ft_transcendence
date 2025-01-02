'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';

const Home = () => {
  const { user } = useUser();
  const { setIsActivated } = useContext(SideBarContext);


  useEffect(() => {
    setIsActivated(1);
  }, [setIsActivated]);
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <h1 className="text-white">Welcome {user?.username}</h1>
      <h1 className="text-white">You are logged in</h1>
    </div>
  );
};

export default Home;
