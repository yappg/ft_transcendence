'use client';
import { SideBarContext } from '@/context/SideBarContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';

const Home = () => {
  const { user } = useUser();
  const router = useRouter();
  const { setIsActivated } = useContext(SideBarContext);

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
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchLogout();
    router.push('/auth/login');
  };
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
