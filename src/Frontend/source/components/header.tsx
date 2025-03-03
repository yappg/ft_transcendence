import { IconSearch } from "@tabler/icons-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { SideBarContext } from "@/context/SideBarContext";
import { useUser } from "@/context/GlobalContext";
import NotificationBell from "@/components/notifications/notifications";
import { SidebarLeft } from "@/components/ui/sidebar-left";
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { Notification } from "@/constants/notifications";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
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
    { id: 1, path: "Welcome" },
    { id: 2, path: "Games" },
    { id: 3, path: "Achievement" },
    { id: 4, path: "Leader Board" },
    { id: 5, path: "Match History" },
    { id: 6, path: "Friends" },
    { id: 7, path: "Live chat" },
    { id: 8, path: "Settings" },
    { id: 9, path: "Profile" },
  ];

  const { isActivated } = useContext(SideBarContext);
  const [value, setValue] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState<Result[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPlayerListOpen, setIsPlayerListOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const router = useRouter();
  const handleClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/notifications/?user_id=${user.id}`,
      );

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        setNotifications((prev: any) => [data, ...prev]);
        setNotificationCount((prev: any) => prev + 1);
      };

      ws.onerror = (error) => {};

      ws.onclose = (event) => {};

      return () => {
        ws.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (filteredPlayers.length > 0) {
      setIsPlayerListOpen(true);
      setIsNotificationOpen(false);
    } else {
      setIsPlayerListOpen(false);
    }
  }, [filteredPlayers]);

  const handlePlayerClick = (playerId: number) => {
    router.push(`/Profile/${playerId}`);
    setFilteredPlayers([]);
    setValue("");
    setIsPlayerListOpen(false);
  };

  const handleNotificationToggle = (isOpen: boolean) => {
    setIsNotificationOpen(isOpen);
    if (isOpen) {
      setFilteredPlayers([]);
      setValue("");
      setIsPlayerListOpen(false);
    }
  };

  if (!user)
    return (
      <div className="flex size-full items-center justify-between">
        <Skeleton className="h-[20px] w-2/4 rounded-[30px] bg-black-crd md:h-[30px] lg:h-[50px]" />
        <div className="flex h-full w-2/4 items-center justify-end gap-2">
          <Skeleton className="size-[17px] rounded-full bg-black-crd sm:size-[20px] md:size-[50px] lg:h-[50px] lg:w-[200px] lg:rounded-[30px]" />
          <Skeleton className="size-[17px] rounded-full bg-black-crd sm:size-[20px] md:size-[50px] lg:size-[70px]" />
        </div>
      </div>
    );

  const fetchUsers = async (value: string) => {
    try {
      const res = await axios.get(`/accounts/search-users/?search=${value}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
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
        console.error("Error processing fetched users:", error);
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
            <h1 className="font-dayson text-[16px] font-black text-black dark:text-white sm:text-[20px] md:text-[25px] lg:text-[32px] xl:text-[36px]">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="font-dayson text-[16px] font-black text-aqua dark:text-fire-red sm:text-[20px] md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {user?.username}
              </span>
            )}
          </div>
        ))}
      <div className="flex w-fit items-center justify-center gap-1 xl:gap-12">
        <button
          className={`${showSearchBar === false ? "flex" : "hidden"} flex items-center justify-center transition-all duration-300 xl:hidden`}
        >
          <div
            className="flex size-[23px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl sm:size-[33px] md:size-[40px]"
            onClick={handleClick}
          >
            <IconSearch className="size-[13px] text-[rgba(28,28,28,0.9)] transition-all duration-300 dark:text-[#B8B8B8] sm:size-[20px] md:size-[30px]" />
          </div>
        </button>
        <div
          className={` ${showSearchBar === false ? "w-0 xl:w-[300px]" : "flex w-[120px] px-2 sm:w-[200px] md:w-[300px]"} relative items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] shadow-xl xl:flex xl:px-2`}
        >
          <IconSearch
            className={`${showSearchBar === false ? "hidden" : "flex"} size-[12px] text-[#B8B8B8] transition-all duration-300 sm:size-[15px] md:size-[30px] xl:flex`}
          />
          <Input
            value={value}
            onChange={handleChange}
            className={`${showSearchBar === false ? "hidden" : "flex"} size-full border-none bg-transparent font-dayson text-[10px] text-white outline-none placeholder:text-[#B8B8B8] xl:flex`}
            placeholder="Search ... "
          />
          <IoCloseOutline
            onClick={handleClick}
            className={`${showSearchBar === false ? "hidden" : "flex"} text-[#B8B8B8]`}
          />
          {filteredPlayers.length > 0 && isPlayerListOpen && (
            <div className="z-90 absolute top-full mt-2 w-full overflow-hidden rounded-lg border-b-2 border-[#B8B8B8] shadow-md">
              {filteredPlayers.map((player: Result) => (
                <div
                  key={player.id}
                  className="flex cursor-pointer items-center gap-2 border-b-2 border-[#B8B8B8] bg-[rgba(28,28,28,0.4)] py-2 hover:bg-gray-700 sm:px-4"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_HOST + player?.avatar}
                    alt={`${player?.display_name}'s avatar`}
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                    unoptimized={true}
                  />
                  <span className="text-white">{player?.display_name}</span>
                </div>
              ))}
            </div>
          )}
          {filteredPlayers.length === 0 &&
            value.length > 0 &&
            !isNotificationOpen && (
              <div className="z-90 absolute top-full mt-2 flex h-[70px] w-[100px] items-center justify-center rounded-lg bg-white text-sm shadow-md sm:w-full">
                <h1>looking for {value}...</h1>
              </div>
            )}
        </div>
        <NotificationBell
          notifications={notifications || []}
          notificationCount={notificationCount}
          setNotificationsCount={setNotificationCount}
          setNotifications={setNotifications}
          onToggle={handleNotificationToggle}
          isOpen={isNotificationOpen}
        />
      </div>
    </div>
  );
};
