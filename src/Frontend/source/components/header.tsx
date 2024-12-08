import { IconSearch } from '@tabler/icons-react';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { IoMdNotifications } from 'react-icons/io';
import { useContext, useEffect, useState, useRef } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { notificationsService } from '@/services/notificationsService';
import { Notification } from '@/constants/notifications'; // Import the Notification type from the correct location
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
  const profile = {
    name: 'Meryeme',
    lastHistory: {
      myscore: 10,
      opponentScore: 5,
      opponentProfile: {
        name: 'John Doe',
        avatar: '/images/avatar.jpg',
      },
    },

  };

  const { isActivated } = useContext(SideBarContext);
  // const { userId } = useContext(AuthContext); // Fetch the user ID from AuthContext
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifclicked, setnotifclicked] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const user = await notificationsService.getCurrentUserId();
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('Error fetching current user ID:', error);
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId !== null) {
      const fetchNotifications = async () => {
        try {
          const notifications = await notificationsService.getNotifications();
          setNotifications(notifications);
          setNotificationCount(notifications.filter((n: any) => !n.read).length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();

      const handleWebSocketMessage = (notification: Notification) => {
        setNotifications(prevNotifications => [notification, ...prevNotifications]);
        setNotificationCount(prevCount => prevCount + 1);
      };

      const setupWebSocket = async () => {
        try {
          socketRef.current = await notificationsService.createWebSocketConnection(
            currentUserId,
            handleWebSocketMessage
          );
        } catch (error) {
          console.error('WebSocket connection failed', error);
        }
      };

      setupWebSocket();

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [currentUserId]);

  function handleClick() {
    setShowSearchBar(true);
  }

  return (
    <div className="flex h-fit w-full items-center justify-between px-4">
      {paths
        .filter((path) => path.id === isActivated)
        .map((path) => (
          <div key={path.id} className="flex h-full w-fit items-center justify-start  gap-4">
            <h1 className=" font-dayson text-[20px] font-black text-black dark:text-white md:text-[25px] lg:text-[32px] xl:text-[36px]">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson text-[20px] font-black text-aqua dark:text-fire-red md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {profile.name}
              </span>
            )}
          </div>
        ))}
      <div className="flex  w-fit items-center justify-center gap-12">
        <button
          className={`${showSearchBar === false ? 'flex' : 'hidden'} flex transition-all duration-300 lg:hidden`}
        >
          <div
            className="size-[30px] items-center justify-center  md:size-[40px]"
            onClick={handleClick}
          >
            <IconSearch className="size-[35px] text-gray-400" />
          </div>
        </button>
        <Command
          className={`${showSearchBar ? 'flex' : 'hidden'} transition-all duration-300 lg:flex lg:w-[340px] xl:w-[400px]`}
        >
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
        <div className="relative flex size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
          <IoMdNotifications className="size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px]" onClick={()=>setnotifclicked(!notifclicked)}/>
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
              {notificationCount}
            </span>
          )}
        </div>
      </div>
      <div className="z-10 absolute top-24 right-4 w-80 bg-white shadow-lg rounded-lg">
        {notifclicked ? (
          notifications.map((notification) => (
            <div key={notification.id} className="p-4 border-b border-gray-200">
              <p>{notification.message}</p>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
};