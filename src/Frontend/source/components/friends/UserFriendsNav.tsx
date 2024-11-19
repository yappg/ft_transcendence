import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { friends } from '@/constants/friendsList';
import FriendsComponent from '@/components/friends/FriendsComponent';
const UserFriendsNav = ({ player }: { player: typeof player }): JSX.Element => {
  const { name, level } = player;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const headers = [
    { title: 'Your Friends', href: '' },
    { title: 'Invitations', href: '' },
    { title: 'Add New', href: '' },
  ];
  const renderContent = () => {
    if (activeIndex === 0) {
      return (
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {friends.map((friend, index) => (
            <FriendsComponent
              key={index}
              name={friend.name}
              ProfilePhoto={friend.profilePhoto}
              level={friend.level}
              wins={friend.wins}
            />
          ))}
        </div>
      );
    } else if (activeIndex === 1) {
      return (
        <div className="flex size-full items-center justify-center">
          <h1 className="text-[30px] text-white">No Invitations</h1>
        </div>
      );
    } else if (activeIndex === 2) {
      return (
        <div className="flex size-full items-center justify-center">
          <h1 className="text-[30px] text-white">Add New</h1>
        </div>
      );
    }
  };
  return (
    <div className="flex size-full w-full flex-col items-start justify-start">
      <div className="friend-bar-bg flex h-[150px] w-full flex-row items-center justify-between px-9">
        <div className="flex flex-row gap-4">
          <Avatar className="md:size-[100px] 2xl:size-[150px]">
            <AvatarImage src="/ProfilePhoto.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col p-6">
            <h1 className="font-dayson text-[20px] text-white opacity-[80%] md:text-[27px] lg:text-[25px] 2xl:text-[35px]">
              {name}
            </h1>
            <h1 className="font-coustard text-white opacity-[40%] md:text-[22px] lg:text-[26px] 2xl:text-[30px]">
              Level {level}
            </h1>
          </div>
        </div>
        <div className="flex h-[60px] w-auto flex-row transition-all duration-300 md:gap-[60px] lg:gap-[100px] xl:gap-[125px] 2xl:gap-[180px]">
          {headers.map((header, index) => (
            <Link href={header.href} key={index}>
              <h1
                className={`${
                  activeIndex === index
                    ? 'border-b-2 border-[#28AFB0] text-[#28AFB0] opacity-[100%] dark:border-[#E43222] dark:text-[#E43222]'
                    : 'text-white opacity-[60%]'
                } font-dayson cursor-pointer transition-all duration-300 md:text-[20px] lg:text-[18px] xl:text-[25px] 2xl:text-[30px]`}
                onClick={() => handleClick(index)}
              >
                {header.title}
              </h1>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[90%] w-full ">{renderContent()}</div>
    </div>
  );
};

export default UserFriendsNav;
