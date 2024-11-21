import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { friends } from '@/constants/friendsList';
import FriendsComponent from '@/components/friends/FriendsComponent';
const UserFriendsNav = (): JSX.Element => {
  const player = {
    name: 'Noureddine Akebli',
    level: 22,
  }
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
              key={index} // Required for React's reconciliation
              index={index} // Pass `index` explicitly as a prop if needed
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
      <div className="friend-bar-bg flex h-[150px] w-full flex-row items-center justify-between px-2 xl:px-5">
        <div className="flex flex-row items-center justify-center lg:gap-4">
          <Avatar className="md:size-[90px] 2xl:size-[150px]">
            <AvatarImage src="/ProfilePhoto.svg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col lg:p-6">
            <h1 className="font-dayson text-[20px] text-white opacity-[80%] md:text-[18px] lg:text-[25px] xl:text-[30px] 2xl:text-[31px]">
              {name}
            </h1>
            <h1 className="font-coustard text-white opacity-[40%] md:text-[17px] lg:text-[22px] xl:text-[27px] 2xl:text-[28px]">
              Level {level}
            </h1>
          </div>
        </div>
        <div className="flex h-[60px] w-auto flex-row items-center transition-all duration-300 md:gap-[25px] lg:gap-[45px] xl:gap-[60px] 2xl:gap-[125px]">
          {headers.map((header, index) => (
            <Link href={header.href} key={index}>
              <h1
                className={`${
                  activeIndex === index
                    ? 'border-b-2 border-[#28AFB0] text-[#28AFB0] opacity-[100%] dark:border-[#E43222] dark:text-[#E43222]'
                    : 'text-white opacity-[60%]'
                } font-dayson cursor-pointer transition-all duration-300 md:text-[18px] lg:text-[18px] xl:text-[22px] 2xl:text-[28px]`}
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
