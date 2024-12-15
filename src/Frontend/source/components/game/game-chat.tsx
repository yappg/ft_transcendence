/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useUser, User } from '@/context/GlobalContext';
// import { useState } from 'react';

// const [playerScore, setplayerScore] = useState();

const PlayerScore = ({ player, isme }: { player: User; isme: boolean }) => {
  return (
    <div className={`flex h-4/5 w-2/5 items-center ${isme ? '' : 'justify-end'}`}>
      <Avatar className={`h-full w-1/2 ${isme ? '' : 'order-3'}`}>
        <AvatarImage src="/Avatar.svg" alt="avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col font-dayson text-[34px] dark:text-white">
        <div>{player.username}</div>
        <div className={`w-full ${isme ? '' : 'text-end'}`}>{'18'}</div>
      </div>
    </div>
  );
};

const GameChat = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-center justify-around gap-8">
      <Link
        href={'#'}
        className="flex h-[60px] w-full items-center justify-start font-dayson text-[48px] dark:text-white"
      >
        <IoIosArrowBack /> <span>Game Arena</span>
      </Link>
      <div className="flex h-[170px] w-full items-end justify-between">
        <PlayerScore player={user || ({} as User)} isme={true} />
        <img src="/logo.svg" alt="logo" className="h-full" />
        <PlayerScore player={user || ({} as User)} isme={false} />
      </div>
    </div>
  );
};

export default GameChat;
