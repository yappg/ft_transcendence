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
        className="relative flex size-8 items-center justify-center transition-all duration-300 md:size-[40px]"
        onClick={() => handleRightClick(id)}
      >
        <div
          className={`${id === selectedId ? 'bg-aqua dark:bg-fire-red' : 'bg-transparent'} size-[40px] rounded-[50px] blur-lg`}
        />
        <Icon
          className={` ${id === selectedId ? 'text-dark-teal dark:text-fire-red' : 'text-[rgba(28,28,28,0.5)] dark:text-white'} ${id === selectedId ? 'h-600-800:size-9 size-14' : 'h-600-800:size-7 size-12'} z-99 hover:text-aqua hover:dark:text-fire-red absolute transition-all duration-300`}
        />
      </div>
    </Link>
  );
  return (
    <div className="h-600-800:w-[80px] bg-side-bar relative hidden h-[100%] min-h-[580px] w-[80px]  min-w-[70px] flex-col items-center justify-between rounded-[50px] pb-4 shadow-2xl transition-all duration-300 md:flex md:w-[10%] lg:w-[97px] ">
      <Image
        src="/Icone.svg"
        alt=""
        width={100}
        height={100}
        className="h-600-800:size-[74px] size-[69px] md:size-[96px] "
      />
      <div className="h-600-800:min-h-[350px] flex h-[300px] min-h-[400px] min-w-[50px] flex-col items-center justify-between md:h-3/5 md:w-[65px]">
        {arr.map((item, index) => {
          return showIcon(item.Icon, item.id, isActivated, item.path);
        })}

        {ShowSideBarIcon &&
          smallScreenIcons.map((item) => {
            return showIcon(item.Icon, item.id, isActivated, item.path);
          })}
      </div>
      <button
        className={`flex size-[50px] items-center justify-center `}
        onClick={() => {
          setIsActivated(8);
          if (isActivated == 8) setIsActivated(0);
        }}
      >
        <div
          className={`${isActivated == 8 ? 'bg-aqua dark:bg-fire-red' : 'bg-transparent'} size-[40px] rounded-[50px] blur-lg`}
        ></div>
        <IconSettingsFilled
          size={isActivated == 8 ? 70 : 60}
          className={`text-[50px] ${isActivated == 8 ? 'text-dark-teal dark:text-fire-red' : 'text-[rgba(28,28,28,0.4)] dark:text-white'} h-600-800:text-[74px] hover:text-aqua hover:dark:text-fire-red absolute z-10 transition-all duration-300`}
        />
      </button>
    </div>
  );
};
