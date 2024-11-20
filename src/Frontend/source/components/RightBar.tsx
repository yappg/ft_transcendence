import Link from 'next/link';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
export const RightBar = ({ handleRightClick }: { handleRightClick: (id: number) => void }) => {
  const { setIsActivated } = useContext(SideBarContext);
  const avatars = [
    { id: 1, path: '/Avatar.svg' },
    { id: 2, path: '/Avatar.svg' },
    { id: 3, path: '/Avatar.svg' },
    { id: 4, path: '/Avatar.svg' },
  ];
  const friends = [
    { id: 1, path: '/Avatar.svg' },
    { id: 2, path: '/Avatar.svg' },
    { id: 3, path: '/Avatar.svg' },
  ];
  function handleClick(id: number) {
    handleRightClick(id);
    setIsActivated(id);
  }
  return (
    <div className="hidden h-[95%] w-[80px] flex-col items-center justify-between transition-all duration-300 md:flex md:w-[70px] lg:w-[97px] ">
      <div className="bg-side-bar min-h[400px] flex h-[55%] max-h-screen min-h-[400px] w-full flex-col items-center justify-start overflow-hidden rounded-[50px] shadow-2xl">
        <Avatar className="size-[60px] md:size-[80px] lg:size-[100px]">
          <AvatarImage src="/ProfilePhoto.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center">
          <Link href="/friends">
            <FaUsers
              onClick={() => handleClick(6)}
              className="hover:text-aqua hover:dark:text-fire-red size-[60px] text-[rgba(28,28,28,0.5)] transition-all duration-300 md:size-[60px] xl:size-[75px] lg:size-[72px] dark:text-white"
            />
          </Link>
        </div>
        <div className=" custom-scrollbar-container mt-8 flex flex-col items-center justify-between gap-7 overflow-y-auto">
          {avatars.map((avatar) => (
            <Avatar
              className="size-[30px] rounded-full md:size-[60px] lg:size-[70px]"
              key={avatar.id}
            >
              <AvatarImage src={avatar.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="bg-side-bar flex h-auto max-h-[80vh] min-h-[300px] w-full flex-col items-center justify-start rounded-[40px] pt-6 shadow-2xl">
        <div className="flex items-center justify-center">
          <Link href="/messages">
            <FaComments
              onClick={() => handleClick(7)}
              className="hover:text-aqua hover:dark:text-fire-red size-[60px] text-[rgba(28,28,28,0.5)] transition-all duration-300 md:size-[60px] xl:size-[75px] lg:size-[72px] dark:text-white"
            />
          </Link>
        </div>
        <div className="custom-scrollbar-container mt-8 flex flex-col items-center justify-between gap-7 overflow-y-auto">
          {friends.map((friend) => (
            <Avatar
              className="size-[40px] rounded-full md:size-[60px] lg:size-[70px]"
              key={friend.id}
            >
              <AvatarImage src={friend.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};
