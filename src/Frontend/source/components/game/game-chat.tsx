import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';

const [playerScore, setplayerScore] = useState();

export const PlayerScore = ({player, oponent}: {player:string, oponent:string}) => {
    return (
        <div className="flex">
            <div>
                <Avatar>
                    <AvatarImage src="/logo.svg" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <div>
                        {player}
                    </div>
                    <div>
                        {score}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const GameChat = () => {
  return (
    <div className="flex flex-col justify-around">
      <div>
        <Link
          href={'#'}
          className="text-white text-[48px] font-dayson flex items-center justify-start w-[400px] h-[60px]"
        >
          <IoIosArrowBack /> <span>Game Arena</span>
        </Link>
        <div className="bg-red-500 w-full h-60">

        </div>
      </div>
    </div>
  );
};
