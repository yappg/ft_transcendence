import { IconSearch } from '@tabler/icons-react';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { IoMdNotifications } from 'react-icons/io';
import { useContext, useEffect, useState } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import NotificationsService from '@/services/notificationsService';
import { chatService} from '@/services/chatService';

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
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the current user's ID
    const fetchCurrentUserId = async () => {
      try {
        const response = await chatService.getCurrentUserId();
        setCurrentUserId(response.id);
        console.log(response.id)
      } catch (error) {
        console.error('Failed to fetch current user ID', error);
      }
    };

    fetchCurrentUserId();
  }, []);


  function handleClick() {
    setShowSearchBar(true);
  }


  // useEffect(() => {
  //   if (!currentUserId) return;

  //   notificationsService.setOnMessageHandler((event) => {
  //     console.log('WebSocket message received:', event.data);
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'new_notification') {
  //       setNotifications((prevNotifications) => [...prevNotifications, data.notification]);
  //       setNotificationCount((prevCount) => prevCount + 1);
  //     } else if (data.status === 'success' && data.message === 'Notification marked as read') {
  //       console.log('Notification marked as read');
  //     } else if (data.status === 'error') {
  //       console.error(data.message);
  //     }
  //   });

  //   return () => {
  //     notificationsService.close();
  //   };
  // }, [currentUserId]);

  // const markAsRead = (notificationId) => {
  //   notificationsService.markAsRead(notificationId);
  // };

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
          <IoMdNotifications className="size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px]" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
              {notificationCount}
            </span>
          )}
        </div>
      </div>
      <div className="absolute top-16 right-4 w-80 bg-white shadow-lg rounded-lg">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 border-b border-gray-200">
            <p>{notification.message}</p>
            <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
          </div>
        ))}
      </div>
    </div>
  );
};