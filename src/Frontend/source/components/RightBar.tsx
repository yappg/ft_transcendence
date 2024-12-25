/* eslint-disable tailwindcss/no-custom-classname */
import Link from 'next/link';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { useRouter } from 'next/navigation';
export const RightBar = ({ handleRightClick }: { handleRightClick: (id: number) => void }) => {
  const router = useRouter();
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
    <div className="hidden h-full w-fit flex-col items-center justify-start gap-7 transition-all duration-300 md:flex ">
      <div className="costum-little-shadow flex h-full max-h-screen w-[80px] flex-col items-center justify-start overflow-hidden rounded-[50px] bg-black-crd">
        <Link href="/Profile" onClick={() => handleClick(9)} >
        <Avatar className="size-auto">
          <AvatarImage src="/ProfilePhoto.svg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        <div className="flex items-center justify-center">
          <Link href="/friends">
            <FaUsers
              onClick={() => handleClick(6)}
              className="size-10 text-[rgba(28,28,28,0.5)] transition-all duration-300 hover:text-aqua dark:text-white  hover:dark:text-fire-red"
            />
          </Link>
        </div>
        <div className=" custom-scrollbar-container flex flex-col items-center justify-start gap-1">
          {avatars.map((avatar) => (
            <Avatar onClick={() => router.push("/Profile/2")} className="size-[80px] rounded-full p-2" key={avatar.id}>
              <AvatarImage src={avatar.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="costum-little-shadow flex min-h-[300px] flex-col items-center justify-start gap-2 rounded-[40px] bg-black-crd pt-4 overflow-hidden">
        <div className="flex items-center justify-center">
          <Link href="/messages">
            <FaComments
              onClick={() => handleClick(7)}
              className="size-10 text-[rgba(28,28,28,0.5)] transition-all duration-300 hover:text-aqua dark:text-white hover:dark:text-fire-red"
            />
          </Link>
        </div>
        <div className="custom-scrollbar-container h-fit flex flex-col items-start justify-start overflow-y-scroll">
          {friends.map((friend) => (
            <Avatar className="size-[80px] rounded-full p-2" key={friend.id}>
              <AvatarImage src={friend.path} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};
