import { GoCheckCircle } from 'react-icons/go';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FriendServices from '@/services/friendServices';
import { useState } from 'react';
import {useEffect} from 'react';

type FriendRequestCardProps = {
  name: string;
  ProfilePhoto: string;
  vari: string;
  actions?: JSX.Element[];
  customStyles?: React.CSSProperties;
};

const FriendRequestCard = ({
  name,
  ProfilePhoto,
  vari,
  actions,
  customStyles = {},
}: FriendRequestCardProps): JSX.Element => {

  const achievements = [
    {
      name: 'Achievement 1',
      icon: '/ach1.svg',
    },
    {
      name: 'Achievement 2',
      icon: '/ach1.svg',
    },
    {
      name: 'Achievement 3',
      icon: '/ach1.svg',
    },
  ];
  async function acceptRequest() {
    console.log('Accepting friend request...', name);
    try {
      const response = await FriendServices.acceptFriendRequest(name);
      console.log('Friend request accepted successfully:', response);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  function handleClick() {
    acceptRequest();
  }
  return (
    <div
      className="bg-black-crd flex h-[150px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] px-10 xl:px-16 2xl:px-28"
      style={customStyles}
    >
      <div className="lg:w[300px] flex h-[75px] flex-row items-center justify-start gap-8 md:w-[150px] xl:w-[400px] xl:gap-10 2xl:w-[500px]">
        <Avatar className="size-[65px] transition-all duration-300 md:size-[70px] lg:size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] w-fit flex-col">
          <h1 className="font-dayson text-[17px] text-[#1C1C1C] opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white">
            {name}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] transition-all duration-300 md:text-[20px] xl:text-[25px]">
            {vari}
          </h1>
        </div>
      </div>

      <div className="relative flex size-auto w-fit flex-row">
        {achievements.map((achievement) => (
          <Avatar
            key={achievement.name}
            className="-ml-[17px] size-[55px] transition-all duration-300 xl:size-[75px]"
          >
            <AvatarImage src={achievement.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex w-[200px] items-center justify-center gap-4 pr-12 xl:gap-8">
        {actions && actions.length > 0 ? (
          actions.map((action, index) => <button key={index}>{action}</button>)
        ) : (
          <>
            <button>
              <GoCheckCircle className="size-[44px] text-white opacity-[50%] transition-all duration-300 hover:opacity-[100%] dark:hover:text-[#E43222]" onClick={handleClick} />
            </button>
            <button>
              <IoCloseCircleOutline className="size-[50px] text-white opacity-[50%] transition-all duration-300 hover:opacity-[100%]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
