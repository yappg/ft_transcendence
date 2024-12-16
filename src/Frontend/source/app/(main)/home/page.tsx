'use client';
import { useAuth } from '@/context/AuthContext';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';

const Home = () => {
  const auth = useAuth();
  const { setIsActivated } = useContext(SideBarContext);

  const handleClick = () => {
    const fetchLogout = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/logout/', {
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
    auth.logout();
  };

  useEffect(() => {
    setIsActivated(1);
  }, [setIsActivated]);
  return (
    <div className="flex size-full items-center justify-center">
      <button onClick={handleClick} className="h-6 w-14 rounded-md bg-blue-400">
        logout
      </button>
    </div>
  );
};

export default Home;
