import { IconSearch } from "@tabler/icons-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { SideBarContext } from "@/context/SideBarContext";
import { useUser } from "@/context/GlobalContext";
import NotificationBell from "@/components/notifications/notifications";
import { SidebarLeft } from "@/components/ui/sidebar-left";
/* eslint-disable tailwindcss/no-custom-classname */
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { IoCloseOutline } from "react-icons/io5";
import { notificationsService } from "@/services/notificationsService";
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

  const router = useRouter();
  const handleClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/notifications/?user_id=${user.id}`);
      console.log('WebSocket connection established');

      ws.onopen = () => {
        console.log("WebSocket connection opened");
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const data = JSON.parse(event.data);
        console.log("----------HERE IS THE NEW EVET", data);

        setNotifications((prev: any) => [data, ...prev]);
        setNotificationCount((prev: any) => prev + 1);
      };

      ws.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };

      return () => {
        ws.close();
        console.log("WebSocket connection closed by component unmount");
      };
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex h-full w-full items-center justify-between">
        <Skeleton className="lg:h-[50px] w-[50%] rounded-[30px] bg-black-crd h-[20px] md:h-[30px]" />
        <div className="flex h-full w-[50%] items-center justify-end gap-2">
          <Skeleton className="lg:h-[50px] lg:w-[200px] lg:rounded-[30px] size-[17px] sm:size-[20px] md:size-[50px] rounded-full bg-black-crd " />
          <Skeleton className=" size-[17px] sm:size-[20px] md:size-[50px] lg:size-[70px] rounded-full bg-black-crd " />
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
          {filteredPlayers.length > 0 && (
            <div className="z-90 absolute top-full mt-2 w-full overflow-hidden rounded-lg border-b-2 border-[#B8B8B8] shadow-md">
              {filteredPlayers.map((player: Result) => (
                <div
                  key={player.id}
                  className="flex cursor-pointer items-center gap-2 border-b-2 border-[#B8B8B8] bg-[rgba(28,28,28,0.4)] py-2 hover:bg-gray-700 sm:px-4"
                  onClick={() => {
                    router.push(`/Profile/${player.id}`);
                    setFilteredPlayers([]);
                    setValue("");
                  }}
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
          {filteredPlayers.length === 0 && value.length > 0 && (
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
        />
      </div>
    </div>
  );
};
