"use client";
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */

import "@/app/globals.css";
import { RightBar } from "@/components/RightBar";
import { SideBar } from "@/components/SideBar";
import { Header } from "@/components/header";
import { UserProvider, useUser } from "@/context/GlobalContext";
import { SideBarContext } from "@/context/SideBarContext";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { onlineService } from '@/services/onlineService';
/* eslint-disable tailwindcss/no-custom-classname */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isActivated, setIsActivated } = useContext(SideBarContext);
  const handleRightClick = (id: number) => {
    setIsActivated(id);
  };
  const { user, fetchCurrentUserDetails, setOnlineStatus } = useUser();

  useEffect(() => {
    if (!user?.username) {
      fetchCurrentUserDetails();
      setOnlineStatus();
    }
    return () => {
      onlineService.closeConnection();
    };
  }, []);

  return (
    // <UserProvider>
      <div className="grid h-screen w-screen grid-cols-[repeat(11,_1fr)] grid-rows-[repeat(9,_1fr)] overflow-hidden bg-linear-gradient dark:bg-linear-gradient-dark md:gap-[8px] md:p-4">
        <div className="row-[span_9_/_span_9] flex min-h-0 grow items-start justify-center md:flex">
          <SideBar pathname={pathname} handleRightClick={handleRightClick} />
        </div>
        <div className="col-start-0 z-50 col-span-full row-start-1 flex items-center justify-start pt-2 transition-all duration-300 md:col-span-10 md:col-start-2">
          <Header />
        </div>
        <div
          className={`${
            isActivated === 7 ||
            isActivated === 6 ||
            isActivated === 4 ||
            isActivated === 6 ||
            isActivated === 9 ||
            pathname === "/friends" ||
            pathname === "/LeaderBoard" ||
            pathname === "/Profile" ||
            pathname === "/MatchHistory" ||
            pathname === "/messages"
              ? "hidden"
              : "hidden lg:flex"
          } col-start-12 row-[span_9_/_span_9] row-start-1 items-start justify-center transition-all duration-300`}
        >
          <RightBar handleRightClick={handleRightClick} />
        </div>

        <div className="col-start-0 z-0 col-span-full row-span-8 row-start-2 flex items-center justify-center md:col-span-10 md:col-start-2 md:p-2">
          {children}
        </div>
      </div>
    // </UserProvider>
  );
}
