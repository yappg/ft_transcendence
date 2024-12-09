'use client';
import { useAuth } from '@/context/AuthContext';
import withAuth from '@/context/requireAhuth';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';

const Home = () => {
  const auth = useAuth();
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
    <div className="size-full flex items-center justify-center">
      <button onClick={handleClick} className="bg-blue-400 rounded-md w-14 h-6">
        logout
      </button>
    </div>
  );
};

export default withAuth(Home, true);
