import Link from 'next/link';
import Image from 'next/image';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
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
    <div className="h-[95%] w-[80px] lg:w-[97px] md:w-[70px] transition-all duration-300 md:flex hidden flex-col items-center justify-between ">
      <div className="h-[55%]  w-full items-center justify-start rounded-[50px] bg-side-bar shadow-2xl">
        <Image
          src="/ProfilePhoto.svg"
          alt=""
          className="w-[69px] h-[69px] md:w-[130px] md:h-[130px]"
          width={100}
          height={100}
        />
        <div className="flex items-center justify-center">
          <Link href="/friends">
            <FaUsers
              onClick={() => handleClick(6)}
              className="text-[50px] size-12 transition-all duration-300 text-[rgba(28,28,28,0.5)] hover:text-[#66C3BD]"
            />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-between gap-10 mt-6">
          {avatars.map((avatar) => (
            <Image
              key={avatar.id}
              src={avatar.path}
              alt={`Avatar ${avatar.id}`}
              width={100}
              height={100}
              className="w-[30px] h-[30px] md:w-[70px] md:h-[70px] rounded-full"
            />
          ))}
        </div>
      </div>
      <div className="h-[40%] w-full items-start justify-center rounded-[40px] bg-side-bar pt-8 shadow-2xl">
        <div className="flex items-center justify-center ">
          <FaComments
            onClick={() => handleClick(7)}
            className="size-16 transition-all duration-300 text-[rgba(28,28,28,0.5)] hover:text-[#66C3BD]"
          />
        </div>
        <div className="flex flex-col items-center justify-between gap-10 mt-12">
          {friends.map((friend) => (
            <Image
              key={friend.id}
              src={friend.path}
              alt={`friend ${friend.id}`}
              width={100}
              height={100}
              className="w-[30px] h-[30px] md:w-[70px] md:h-[70px] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
