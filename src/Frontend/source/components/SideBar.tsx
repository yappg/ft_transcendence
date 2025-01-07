/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconConeFilled } from "@tabler/icons-react";
import { IconDeviceGamepad3Filled } from "@tabler/icons-react";
import { IconCarambolaFilled } from "@tabler/icons-react";
import { FaTrophy } from "react-icons/fa";
import { IconChartDonutFilled } from "@tabler/icons-react";
import { IconSettingsFilled } from "@tabler/icons-react";
import { FaComments } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { SideBarContext } from "@/context/SideBarContext";

export const SideBar = ({
  pathname,
  handleRightClick,
}: {
  pathname: string;
  handleRightClick: (id: number) => void;
}) => {
  const { isActivated, setIsActivated } = useContext(SideBarContext);
  const arr = [
    { Icon: IconConeFilled, id: 1, path: "/home" },
    { Icon: IconDeviceGamepad3Filled, id: 2, path: "/games" },
    { Icon: IconCarambolaFilled, id: 3, path: "/achievement" },
    { Icon: FaTrophy, id: 4, path: "/LeaderBoard" },
    { Icon: IconChartDonutFilled, id: 5, path: "/MatchHistory" },
  ];

  const smallScreenIcons = [
    { Icon: FaUsers, id: 6, path: "/friends" },
    { Icon: FaComments, id: 7, path: "/messages" },
  ];

  const showIcon = (
    Icon: any,
    id: number,
    selectedId: number,
    path: string,
  ) => (
    <Link href={path} key={id}>
      <div
        className="relative flex size-8 items-center justify-center transition-all duration-300 md:size-[40px]"
        onClick={() => handleRightClick(id)}
      >
        <div
          className={`${id === selectedId ? "bg-aqua dark:bg-fire-red" : "bg-transparent"} size-[40px] rounded-[50px] blur-lg`}
        />
        <Icon
          className={` ${id === selectedId ? "text-dark-teal dark:text-fire-red" : "text-[rgba(28,28,28,0.5)] dark:text-white"} ${
            id === selectedId
              ? "h-600-800:size-9 size-12"
              : "h-600-800:size-7 size-10"
          } z-99 absolute transition-all duration-300 hover:text-aqua hover:dark:text-fire-red`}
        />
      </div>
    </Link>
  );

  return (
    <div className="costum-little-shadow relative hidden h-full min-h-[550px] w-auto flex-col items-center justify-between rounded-[50px] bg-black-crd px-1 pb-4 transition-all duration-300 md:flex">
      <Image
        src="/logo.svg"
        alt=""
        width={50}
        priority
        height={50}
        className="h-600-800:size-[74px] size-[80px]"
      />
      <div
        className={`flex w-full flex-col items-center ${
          isActivated === 7 ||
          isActivated === 6 ||
          isActivated === 8 ||
          isActivated === 9 ||
          pathname === "/friends" ||
          pathname === "/profile" ||
          pathname === "/settings" ||
          pathname === "/messages"
            ? "gap-3"
            : "gap-6"
        } px-2`}
      >
        {arr.map((item) => {
          return showIcon(item.Icon, item.id, isActivated, item.path);
        })}

        {(pathname === "/friends" ||
          pathname === "/messages" ||
          pathname === "/LeaderBoard" ||
          pathname === "/MatchHistory" ||
          pathname === "/Profile") &&
          smallScreenIcons.map((item) => {
            return showIcon(item.Icon, item.id, isActivated, item.path);
          })}
      </div>
      <Link
        className={`flex size-[50px] items-center justify-center `}
        href="/settings"
        onClick={() => {
          if (isActivated == 8) handleRightClick(0);
          handleRightClick(8);
        }}
      >
        <div
          className={`${isActivated == 8 ? "bg-aqua dark:bg-fire-red" : "bg-transparent"} size-[40px] rounded-[50px] blur-lg`}
        ></div>
        <IconSettingsFilled
          size={isActivated == 8 ? 70 : 60}
          className={`text-[40px] ${isActivated == 8 ? "text-dark-teal dark:text-fire-red" : "text-[rgba(28,28,28,0.4)] dark:text-white"} h-600-800:text-[74px] absolute z-10 transition-all duration-300 hover:text-aqua hover:dark:text-fire-red`}
        />
      </Link>
    </div>
  );
};
