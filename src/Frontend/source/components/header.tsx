import { IconSearch } from '@tabler/icons-react';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { useContext, useEffect, useState, useRef } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { useUser } from '@/context/GlobalContext';

import NotificationBell from  '@/components/notifications/notifications'

export const Header = () => {
  const paths = [
    { id: 1, path: 'Welcome' },
    { id: 2, path: 'Games' },
    { id: 3, path: 'Achievement' },
    { id: 4, path: 'Leader Board' },
    { id: 5, path: 'Match History' },
    { id: 6, path: 'Friends' },
    { id: 7, path: 'Live chat' },
  ];

  const { isActivated } = useContext(SideBarContext);

  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleClick = () => {
    setShowSearchBar(true);
  };

  const { user, notifications, notificationCount, setNotifications, setNotificationCount } = useUser();

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(`ws://localhost:8080/ws/notifications/?user_id=${user.id}`);
      console.log('WebSocket connection established');
  
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };
  
      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const data = JSON.parse(event.data);
        console.log("----------HERE IS THE NEW EVET", data)
        setNotifications((prev) => [data, ...prev]);
        setNotificationCount((prev) => prev + 1);
      };
  
      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };
  
      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
  
      return () => {
        ws.close();
        console.log('WebSocket connection closed by component unmount');
      };
    }
  }, [user, setNotifications, setNotificationCount]);

  if (!user)
    return (
      <h1 className="size-[200px] flex justify-center items-center font-dayson rounded-md text-[30px] text-gray-600">
      Loading...
    </h1>
    );
  
  return (
    <div className="flex h-fit w-full items-center justify-between px-4">
      {paths
        .filter((path) => path.id === isActivated)
        .map((path) => (
          <div key={path.id} className="flex h-full w-fit items-center justify-start gap-4">
            <h1 className="font-dayson text-[20px] font-black text-black dark:text-white md:text-[25px] lg:text-[32px] xl:text-[36px]">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson text-[20px] font-black text-aqua dark:text-fire-red md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {user.username}
              </span>
            )}
          </div>
        ))}
      <div className="flex w-fit items-center justify-center gap-12">
        <button
          className={`${showSearchBar === false ? 'flex' : 'hidden'} flex transition-all duration-300 lg:hidden`}
        >
          <div className="size-[30px] items-center justify-center md:size-[40px]" onClick={handleClick}>
            <IconSearch className="size-[35px] text-gray-400" />
          </div>
        </button>
        <Command className={`${showSearchBar ? 'flex' : 'hidden'} transition-all duration-300 lg:flex lg:w-[340px] xl:w-[400px]`}>
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
        <NotificationBell notifications={notifications} notificationCount={notificationCount} />
      </div>
    </div>
  );
};