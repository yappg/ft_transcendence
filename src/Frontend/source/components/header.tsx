import { IconSearch } from '@tabler/icons-react';
import { useContext, useEffect, useState, useRef } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { useUser } from '@/context/GlobalContext';
import NotificationBell from '@/components/notifications/notifications';
import { SidebarLeft } from '@/components/ui/sidebar-left';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from './ui/input';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from 'react-icons/io5';
import { notificationsService } from '@/services/notificationsService';
import { Notification } from '@/constants/notifications';

export interface Root {
  count: number;
  results: Result[];
}

export interface Result {
  id: number;
  display_name: string;
  avatar: string;
  is_online: boolean;
}

export const Header = () => {
  const paths = [
    { id: 1, path: 'Welcome' },
    { id: 2, path: 'Games' },
    { id: 3, path: 'Achievement' },
    { id: 4, path: 'Leader Board' },
    { id: 5, path: 'Match History' },
    { id: 6, path: 'Friends' },
    { id: 7, path: 'Live chat' },
    { id: 8, path: 'Settings' },
    { id: 9, path: 'Profile' },
  ];

  const { isActivated } = useContext(SideBarContext);
  const [value, setValue] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState<Result[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const router = useRouter();
  const handleClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  //   const fetchNotifications = async () => {
  //   try {
  //     const fetchedNotifications = await notificationsService.getNotifications();
  //     setNotifications(fetchedNotifications as Notification[]);
  //   } catch (err) {
  //     setNotifications([]);
  //     setNotificationCount(0);
  //   }
  // };

  // ------Omar's code
  const { user } = useUser();

  useEffect(() => {
    // fetchNotifications();
    if (user) {
      const ws = new WebSocket(`ws://localhost:8080/ws/notifications/?user_id=${user.id}`);
      console.log('WebSocket connection established');

      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        const data = JSON.parse(event.data);
        console.log('----------HERE IS THE NEW EVET', data);

        setNotifications((prev: any) => [data, ...prev]);
        setNotificationCount((prev: any) => prev + 1);
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
  }, [user]);

  if (!user)
    return (
      <h1 className="font-dayson flex size-[200px] items-center justify-center rounded-md text-[30px] text-gray-600">
        Loading...
      </h1>
    );

  const fetchUsers = async (value: string) => {
    try {
      const res = await axios.get(`accounts/search-users/?search=${value}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue(searchValue);

    if (searchValue) {
      try {
        const resData = await fetchUsers(searchValue);
        if (resData && resData.results) {
          setFilteredPlayers(resData.results);
        }
      } catch (error) {
        console.error('Error processing fetched users:', error);
      }
    } else {
      setFilteredPlayers([]);
    }
  };

  return (
    <div className="flex h-fit w-full items-center justify-between px-4">
      <div className="flex size-[50px] md:hidden">
        <SidebarProvider>
          <SidebarLeft />
          <SidebarInset className="bg-transparent">
            <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2">
              <div>
                <SidebarTrigger />
              </div>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </div>
      {paths
        .filter((path) => path.id === isActivated)
        .map((path) => (
          <div
            key={path.id}
            className="flex h-full w-fit items-center justify-start gap-2 sm:gap-4"
          >
            <h1 className="font-dayson text-[16px] font-black text-black sm:text-[20px] md:text-[25px] lg:text-[32px] xl:text-[36px] dark:text-white">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson text-aqua dark:text-fire-red text-[16px] font-black sm:text-[20px] md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {user.username}
              </span>
            )}
          </div>
        ))}
      <div className="flex w-fit items-center justify-center gap-1 xl:gap-12 ">
        <button
          className={`${showSearchBar === false ? 'flex' : 'hidden'} flex items-center justify-center transition-all duration-300 xl:hidden`}
        >
          <div
            className="flex size-[23px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl sm:size-[33px] md:size-[40px]"
            onClick={handleClick}
          >
            <IconSearch className="size-[13px] text-[rgba(28,28,28,0.9)] transition-all duration-300 sm:size-[20px] md:size-[30px] dark:text-[#B8B8B8]" />
          </div>
        </button>
        <div
          className={` ${showSearchBar === false ? 'w-0 xl:w-[300px]' : 'flex w-[120px] px-2 sm:w-[200px] md:w-[300px]'} relative  items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] shadow-xl xl:flex xl:px-2`}
        >
          <IconSearch
            className={`${showSearchBar === false ? 'hidden' : 'flex'} size-[12px] text-[#B8B8B8] transition-all duration-300 sm:size-[15px] md:size-[30px] xl:flex`}
          />
          <Input
            value={value}
            onChange={handleChange}
            className={`${showSearchBar === false ? 'hidden' : 'flex'} font-dayson size-full border-none bg-transparent text-[10px] text-white outline-none placeholder:text-[#B8B8B8] xl:flex`}
            placeholder="Search ... "
          />
          <IoCloseOutline
            onClick={handleClick}
            className={`${showSearchBar === false ? 'hidden' : 'flex'} text-[#B8B8B8]`}
          />
          {filteredPlayers.length > 0 && (
            <div className="absolute top-full mt-2 w-full overflow-hidden rounded-lg border-b-2 border-[#B8B8B8] shadow-md">
              {filteredPlayers.map((player: Result) => (
                <div
                  key={player.id}
                  className="flex cursor-pointer items-center gap-2 border-b-2 border-[#B8B8B8] bg-[rgba(28,28,28,0.4)] px-4 py-2 hover:bg-gray-700"
                  onClick={() => {
                    router.push(`/Profile/${player.id}`);
                    setFilteredPlayers([]);
                    setValue('');
                  }}
                >
                  <img
                    src={`http://localhost:8080${player?.avatar}`}
                    alt={`${player?.display_name}'s avatar`}
                    className="size-10 rounded-full"
                  />
                  <span className="text-white">{player?.display_name}</span>
                </div>
              ))}
            </div>
          )}
          {filteredPlayers.length === 0 && value.length > 0 && (
            <div className="absolute top-full mt-2 flex h-[100px] w-full items-center justify-center rounded-lg bg-white shadow-md">
              <h1>No players found</h1>
            </div>
          )}
        </div>
        <NotificationBell
          notifications={notifications || []}
          notificationCount={notificationCount}
          setNotificationsCount={setNotificationCount}
        />
      </div>
    </div>
  );
};
