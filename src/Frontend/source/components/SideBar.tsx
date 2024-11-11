'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconConeFilled } from '@tabler/icons-react';
import { IconDeviceGamepad3Filled } from '@tabler/icons-react';
import { IconCarambolaFilled } from '@tabler/icons-react';
import { FaTrophy } from 'react-icons/fa';
import { IconChartDonutFilled } from '@tabler/icons-react';
import { IconSettingsFilled } from '@tabler/icons-react';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';

export const SideBar = ({
  isActivated,
  setIsActivated,
  ShowSideBarIcon,
  handleRightClick,
  setShowSideBarIcon,
}: {
  isActivated: number;
  setIsActivated: (id: number) => void;
  ShowSideBarIcon: boolean;
  handleRightClick: (id: number) => void;
  setShowSideBarIcon: (value: boolean) => void;
}) => {
  const arr = [
    { Icon: IconConeFilled, id: 1, path: '/Home' },
    { Icon: IconDeviceGamepad3Filled, id: 2, path: '/games' },
    { Icon: IconCarambolaFilled, id: 3, path: '/stars' },
    { Icon: FaTrophy, id: 4, path: '/trophies' },
    { Icon: IconChartDonutFilled, id: 5, path: '/achievement' },
  ];
  const smallScreenIcons = [
    { Icon: FaUsers, id: 6, path: '/Friends' },
    { Icon: FaComments, id: 7, path: '/messages' },
  ];
  function handleClick(id: number, index: number) {
    if (id == 7 || id == 6) {
      setShowSideBarIcon(true);
    } else setShowSideBarIcon(false);
    setIsActivated(id);
  }
  const showIcon = (Icon: any, id: number, selectedId: number, path: string) => (
    <Link href={path} key={id}>
      <div
        className="size-8 md:h-[40px] md:w-[40px] relative flex items-center justify-center transition-all duration-300"
        onClick={() => handleRightClick(id)}
      >
        <div
          className={`${id === selectedId ? 'bg-aqua dark:bg-fire-red' : 'bg-transparent'} w-[40px] h-[40px] blur-lg rounded-[50px]`}
        />
        <Icon
          className={` ${id === selectedId ? 'text-dark-teal dark:text-fire-red' : 'text-[rgba(28,28,28,0.5)] dark:text-white'} ${id === selectedId ? 'size-14 h-600-800:size-9' : 'size-12 h-600-800:size-7'} transition-all duration-300 absolute z-99 hover:text-aqua hover:dark:text-fire-red`}
        />
      </div>
    </Link>
  );
  return (
    <div className="min-h-[580px] md:flex hidden relative w-[80px] h-600-800:w-[80px] lg:w-[97px]  md:w-[10%] min-w-[70px] h-[95%] pb-4 bg-side-bar rounded-[50px] flex-col items-center justify-between shadow-2xl transition-all duration-300 ">
      <Image
        src="/Icone.svg"
        alt=""
        width={100}
        height={100}
        className="w-[69px] h-[69px] h-600-800:w-[74px] h-600-800:h-[74px] md:w-[96px] md:h-[96px] "
      />
      <div className="flex flex-col items-center justify-between md:h-[60%] md:w-[65px] h-[300px] min-h-[400px] h-600-800:min-h-[350px] min-w-[50px]">
        {arr.map((item, index) => {
          return showIcon(item.Icon, item.id, isActivated, item.path);
        })}

        {ShowSideBarIcon &&
          smallScreenIcons.map((item) => {
            return showIcon(item.Icon, item.id, isActivated, item.path);
          })}
      </div>
      <button
        className={`flex items-center justify-center w-[50px] h-[50px] `}
        onClick={() => {
          setIsActivated(8);
          if (isActivated == 8) setIsActivated(0);
        }}
      >
        <div
          className={`${isActivated == 8 ? 'bg-aqua dark:bg-fire-red' : 'bg-transparent'} w-[40px] h-[40px] blur-lg rounded-[50px]`}
        ></div>
        <IconSettingsFilled
          size={isActivated == 8 ? 70 : 60}
          className={`text-[50px] ${isActivated == 8 ? 'text-dark-teal dark:text-fire-red' : 'text-[rgba(28,28,28,0.4)] dark:text-white'} h-600-800:text-[74px] transition-all duration-300 absolute z-10 hover:text-aqua hover:dark:text-fire-red`}
        />
      </button>
    </div>
  );
};
