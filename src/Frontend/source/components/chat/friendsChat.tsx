/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';

interface FChatProps {
  imageutl: string;
  name: string;
  text: string;
  time: string;
  unread: number;
}

const FriendsChat = ({ imageutl, name, text, time, unread }: FChatProps) => {
  return (
    <div className="flex h-[100px] w-full items-center justify-between gap-2 border-b border-gray-400 px-2 text-white">
      <div className="flex h-full w-3/4 items-center justify-start gap-2 p-2">
        <div className="flex size-[60px] items-center justify-center rounded-full">
          <img src={imageutl} alt={`${name} PDP`} />
        </div>
        <div className="w-4/5">
          <h1>{name}</h1>
          <p className="line-clamp-1 w-full text-ellipsis text-[rgb(255,255,255,0.5)]">{text}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm text-[rgb(255,255,255,0.5)]">{time}</h3>
        <div
          className={`${unread > 0 ? 'dark:bg-primary-dark bg-green-300' : 'border border-[rgb(255,255,255,0.5)] bg-transparent text-[rgb(255,255,255,0.5)]'} flex size-[20px] items-center justify-center rounded-full text-xs`}
        >
          {unread > 0 ? unread : <RiCheckDoubleLine />}
        </div>
      </div>
    </div>
  );
};

export default FriendsChat;
