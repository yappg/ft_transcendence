'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useEffect } from 'react';

const Home = () => {
  const { setIsActivated } = useContext(SideBarContext);
  const router = useRouter();

  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch('http://localhost:8080/accounts/auth/logout/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLogout();
    router.push('/home');
  };

  useEffect(() => {
    setIsActivated(1);
  }, [setIsActivated]);
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <button onClick={handleClick} className="h-6 w-14 rounded-md bg-blue-400">
        logout
      </button>
    </div>
  );
};

export default Home;
