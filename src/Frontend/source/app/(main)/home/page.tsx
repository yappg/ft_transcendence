'use client';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/GlobalContext';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';

const Home = () => {
  const auth = useAuth();
  const { setIsActivated } = useContext(SideBarContext);
  const { user } = useUser();
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
    auth.logout();
  };
  console.log('user: ', user);
  useEffect(() => {
    setIsActivated(1);
  }, [setIsActivated]);
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <h1 className="text-white">Welcome {user?.username}</h1>
      <h1 className="text-white">You are logged in</h1>
      <button onClick={handleClick} className="h-6 w-14 rounded-md bg-blue-400">
        logout
      </button>
    </div>
  );
};

export default Home;
