import { IconSearch } from '@tabler/icons-react';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useContext, useEffect, useState, useRef } from 'react';
import { SideBarContext } from '@/context/SideBarContext';

import { useUser } from '@/context/GlobalContext';
import { RiMenu2Fill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import NotificationBell from  '@/components/notifications/notifications'
import { SidebarLeft } from '@/components/ui/sidebar-left';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from './ui/input';
import axios from 'axios';
import { Avatar } from './ui/avatar';
import { useRouter } from 'next/navigation';


const search = axios.create({
  baseURL: 'http://localhost:8080/accounts/',
  withCredentials: true,
});


export interface Root {
  count: number
  results: Result[]
}

export interface Result {
  id: number
  display_name: string
  avatar: string
  is_online: boolean
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
  const [filteredPlayers, setFilteredPlayers] = useState<Result>([]);
  const {user, isLoading} = useUser();
  const router = useRouter();

  const mockPlayers = [
    { id: 1, avatar: '/ProfilePhoto.svg', display_name: 'PlayerOne' },
    { id: 2, avatar: '/ProfilePhoto.svg', display_name: 'PlayerTwo' },
    { id: 3, avatar: '/ProfilePhoto.svg', display_name: 'PlayerThree' },
    { id: 4, avatar: '/ProfilePhoto.svg', display_name: 'PlayerFour' },

  ];

  if (!user)
    return (
      <h1 className="size-[200px] flex justify-center items-center font-dayson rounded-md text-[30px] text-gray-600">
      Loading...
    </h1>
    );
  

  const fetchUsers = async (value: string) => {
    try {
      const res = await search.get(`search-users/?search=${value}`);
      return res.data;
    }  catch (error) {
      console.error('Error fetching users:', error);
    }
  }
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

  function handleClick() {
    setShowSearchBar(true);
  }
  return (
    <div className="flex h-fit w-full items-center justify-between px-4">
      <div className="md:hidden flex size-[50px]">
        <SidebarProvider >
        <SidebarLeft className="bg-transparent" />
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
          <div key={path.id} className="flex h-full w-fit items-center justify-start sm:gap-4 gap-2">
            <h1 className="font-dayson text-[16px] sm:text-[20px] font-black text-black dark:text-white md:text-[25px] lg:text-[32px] xl:text-[36px]">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson sm:text-[20px] text-[16px] font-black text-aqua dark:text-fire-red md:text-[25px] lg:text-[32px] xl:text-[36px]">
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
          <div className={` ${showSearchBar === false ? 'w-[300px]' : 'md:w-[300px] sm:w-[200px] w-[120px] flex px-2'} relative  xl:flex items-center justify-center bg-[rgba(28,28,28,0.4)] rounded-full shadow-xl xl:px-2`}>
            <IconSearch className={`${showSearchBar === false ? 'hidden' : 'flex'} xl:flex size-[12px] sm:size-[15px] text-[#B8B8B8] md:size-[30px] transition-all duration-300`} />
            <Input
              value={value}
              onChange={handleChange}
              className={`${showSearchBar === false ? 'hidden' : 'flex'} xl:flex w-full h-full bg-transparent outline-none text-white placeholder:text-white text-[15px] border-none`}
              placeholder="Search ... "
            />
            {filteredPlayers.length > 0 && (
              <div className="absolute overflow-hidden top-full mt-2 w-full rounded-lg shadow-md border-b-2 border-[#B8B8B8]">
                {filteredPlayers.map((player : Result) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer bg-[rgba(28,28,28,0.4)] border-b-2 border-[#B8B8B8]"
                    onClick={() => { router.push(`/Profile/${player.id}`); setFilteredPlayers([]); setValue(''); }}
                  >
                    <img
                      src={"http://localhost:8080" + player?.avatar}
                      // alt={`${player?.display_name}'s avatar`}
                      className="size-10 rounded-full"
                    />
                    <span className="text-white">{player?.display_name}</span>
                  </div>
                ))}
              </div>
            )}
            {
              filteredPlayers.length === 0 && value.length > 0 && (
                <div className="absolute top-full mt-2 w-full h-[100px] bg-white rounded-lg shadow-md flex items-center justify-center">
              <h1>No players found</h1>
            </div>
              )
            }
          </div>
        <div className="flex size-[23px] sm:size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
          <IoMdNotifications className="size-[13px] sm:size-[20px] text-[rgba(28,28,28,0.9)] dark:text-[#B8B8B8] md:size-[30px]" />
        </div>
      </div>
    </div>
  );
};