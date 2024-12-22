import { IconSearch } from '@tabler/icons-react';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { useContext, useEffect, useState, useRef } from 'react';
import { SideBarContext } from '@/context/SideBarContext';

import { useUser } from '@/context/GlobalContext';
import { RiMenu2Fill } from "react-icons/ri";

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
    { id: 8, path: 'Settings' },
    { id: 9, path: 'Profile' },
  ];

  const { isActivated } = useContext(SideBarContext);

  const [showSearchBar, setShowSearchBar] = useState(false);

  const {user, isLoading} = useUser();

  if (!user)
    return (
      <h1 className="size-[200px] flex justify-center items-center font-dayson rounded-md text-[30px] text-gray-600">
      Loading...
    </h1>
    );
  
  // here we gonna build the notif logic
  return (
    <div className="flex h-fit w-full items-center justify-between md:px-4 px-0">
      {paths
        .filter((path) => path.id === isActivated)
        .map((path) => (
          <div key={path.id} className="flex h-full w-fit items-center justify-start sm:gap-4 gap-2">
            <h1 className="font-dayson text-[12px] sm:text-[20px] font-black text-black dark:text-white md:text-[25px] lg:text-[32px] xl:text-[36px]">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson text-[20px] font-black text-aqua dark:text-fire-red md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {user.username}
              </span>
            )}
          </div>
        ))}
      <div className="flex w-fit items-center justify-center xl:gap-12 gap-1">
        <button
          className={`${showSearchBar === false ? 'flex' : 'hidden'} flex transition-all duration-300 xl:hidden items-center justify-center`}
        >
          <div
            className="flex size-[23px] sm:size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]"
            onClick={handleClick}
          >
            <IconSearch className="size-[13px] sm:size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px] transition-all duration-300" />
          </div>
        </button>
        <Command
          className={`${showSearchBar ? 'md:w-[300px] sm:w-[200px] w-[120px]' : 'w-[0px]'} transition-all duration-300 xl:flex xl:w-[400px]`}
        >
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
        <div className="flex size-[23px] sm:size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
          <IoMdNotifications className="size-[13px] sm:size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px]" />
        </div>
      </div>
    </div>
  );
};