/* eslint-disable tailwindcss/no-custom-classname */
import Link from 'next/link';
import { FaComments } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContext } from 'react';
import { SideBarContext } from '@/context/SideBarContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Friend } from '@/components/friends/UserFriendsNav';
import FriendServices from '@/services/friendServices';
import { useUser } from '@/context/GlobalContext';
export const RightBar = ({ handleRightClick }: { handleRightClick: (id: number) => void }) => {
  const router = useRouter();
  const { setIsActivated } = useContext(SideBarContext);
  const { chats, user } = useUser();
  function handleClick(id: number) {
    handleRightClick(id);
    setIsActivated(id);
  }

  const [friends, setFriends] = useState<Friend[]>([]);


  const fetchFriends = async () => {
    try {
      const friendsData = await FriendServices.getFriends();
      console.log('Fetched friends:', friendsData);
      setFriends(friendsData.data);
    } catch (error: any) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [user?.id]);

  return (
    <div className="hidden h-full w-fit flex-col items-center justify-start gap-7 transition-all duration-300 md:flex ">
      <div className="costum-little-shadow flex h-full max-h-screen w-[80px] flex-col items-center justify-start overflow-hidden rounded-[50px] bg-black-crd">
        <Link href="/Profile" onClick={() => handleClick(9)} >
        <Avatar className="size-auto">
          <AvatarImage src={process.env.NEXT_PUBLIC_HOST + user?.avatar} />
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
        <div className="size-full custom-scrollbar-container items-center flex flex-col gap-3">
          {friends.length > 0 && friends.map((friend) => (
            <Avatar
              onClick={() => router.push(`/Profile/${friend.id}`)}
              className="size-[60px] rounded-full  cursor-pointer hover:scale-110 transition-transform duration-300"
              key={friend.id}
            >
              <AvatarImage src={process.env.NEXT_PUBLIC_HOST + friend.avatar} alt={friend.display_name || 'User'} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="costum-little-shadow flex min-h-[300px] flex-col items-center justify-start gap-2 rounded-[40px] bg-black-crd pt-4 overflow-hidden w-[80px]">
        <div className="flex items-center justify-center">
          <Link href="/messages">
            <FaComments
              onClick={() => handleClick(7)}
              className="size-10 text-[rgba(28,28,28,0.5)] transition-all duration-300 hover:text-aqua dark:text-white hover:dark:text-fire-red"
            />
          </Link>
        </div>
        <div className="size-full custom-scrollbar-container items-center flex flex-col gap-3">
          {chats && chats.length > 0 && chats.map((chat) => (
            <Avatar
              onClick={() => router.push(`/messages/${chat.id}`)}
              className="size-[60px] rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
              key={chat.id}
            >
              <AvatarImage src={process.env.NEXT_PUBLIC_HOST + chat.receiver.avatar} alt={chat.receiver.username || 'User'} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
};
