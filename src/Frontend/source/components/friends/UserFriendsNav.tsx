import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const UserFriendsNav = ({ player }: { player: player }): JSX.Element => {
  const { name, level } = player;
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // State to track the active header

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const headers = [
    { title: 'Your Friends', href: '' },
    { title: 'Invitations', href: '' },
    { title: 'Add New', href: '' },
  ];
  return (
    <div className="flex flex-row items-center gap-[800px]">
      <div className="flex flex-row gap-4">
        <Avatar className="size-[150px]">
          <AvatarImage src="/ProfilePhoto.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col p-6">
          <h1 className="font-dayson text-[35px] text-white opacity-[80%]">{name}</h1>
          <h1 className="font-coustard text-[30px] text-white opacity-[40%]">Level {level}</h1>
        </div>
      </div>
      <div className="flex h-[60px] w-auto flex-row gap-20">
        {headers.map((header, index) => (
          <Link href={header.href} key={index}>
            <h1
              className={`${
                activeIndex === index
                  ? 'border-b-2 border-[#28AFB0] text-[#28AFB0] opacity-[100%]'
                  : 'text-white opacity-[60%]'
              } font-dayson cursor-pointer text-[30px] transition-all duration-300`}
              onClick={() => handleClick(index)}
            >
              {header.title}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserFriendsNav;
