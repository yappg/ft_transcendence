import Link from 'next/link';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export const RightBar = ({
  handleRightClick,
  setIsActivated,
  isActivated,
}: {
  handleRightClick: (id: number) => void;
  setIsActivated: (id: number) => void;
  isActivated: number;
}) => {
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
      <div className="bg-side-bar  h-[55%] w-full items-center justify-start overflow-hidden rounded-[50px] shadow-2xl">
        <Avatar className="size-[60px] md:size-[100px]">
          <AvatarImage src="/ProfilePhoto.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center">
          <Link href="/friends">
            <FaUsers
              onClick={() => handleClick(6)}
              className="h-600-800:size-9 hover:text-aqua hover:dark:text-fire-red size-12 text-[50px] text-[rgba(28,28,28,0.5)] transition-all duration-300 dark:text-white"
            />
          </Link>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-10">
          {avatars.map((avatar) => (
            <Avatar className="size-[30px] rounded-full md:size-[70px]" key={avatar.id}>
              <AvatarImage src={avatar.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="bg-side-bar h-2/5 w-full items-start justify-center overflow-hidden rounded-[40px] pt-8 shadow-2xl">
        <div className="flex items-center justify-center">
          <Link href="/messages">
            <FaComments
              onClick={() => handleClick(7)}
              className="h-600-800:size-9 hover:text-aqua hover:dark:text-fire-red size-16 text-[rgba(28,28,28,0.5)] transition-all duration-300 dark:text-white"
            />
          </Link>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-10">
          {friends.map((friend) => (
            <Avatar className="size-[30px] rounded-full md:size-[70px]" key={friend.id}>
              <AvatarImage src={friend.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};
