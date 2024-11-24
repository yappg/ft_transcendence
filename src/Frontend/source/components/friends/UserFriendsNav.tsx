import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { friends } from '@/constants/friendsList';
import FriendsComponent from '@/components/friends/FriendsComponent';
import InvitationsComponent from './InivationsComponent';
import { invitations } from '@/constants/InvitationsList';
const UserFriendsNav = (): JSX.Element => {
  const player = {
    name: 'Noureddine Akebli',
    level: 22,
  };
  // const { name, level } = player;
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
              index={index}
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
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {invitations.map((invitation, index) => (
            <InvitationsComponent 
            key={index}
            name={invitation.senderName}
            ProfilePhoto={invitation.senderProfilePhoto}
            sendAt={invitation.sentAt}
            />
          ))}
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
      <div className="friend-bar-bg flex h-fit w-full flex-row items-center justify-between px-2 md:pr-4">
        <div className="flex h-fit flex-row items-center justify-between">
          <Avatar className="max-w-[120px] md:size-auto ">
            <AvatarImage src="/ProfilePhoto.svg" />
            <AvatarFallback className="bg-[rgba(28,28,28,0.5)] size-[80px] m-2 font-dayson text-lg text-white">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <h1 className="font-dayson text-[20px] text-white opacity-[80%] md:text-[18px] lg:text-[25px] xl:text-[30px] 2xl:text-[31px]">
              {player.name}
            </h1>
            <h1 className="font-coustard text-white opacity-[40%] md:text-[17px] lg:text-[22px] xl:text-[27px] 2xl:text-[28px]">
              Level {player.level}
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
                } cursor-pointer font-dayson transition-all duration-300 md:text-[18px] lg:text-[18px] xl:text-[22px] 2xl:text-[28px] text-center`}
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
