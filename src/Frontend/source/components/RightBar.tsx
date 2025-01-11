/* eslint-disable tailwindcss/no-custom-classname */
import Link from "next/link";
import { FaComments } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { SideBarContext } from "@/context/SideBarContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Friend } from "@/components/friends/UserFriendsNav";
import FriendServices from "@/services/friendServices";
import { useUser } from "@/context/GlobalContext";
import { Skeleton } from "./ui/skeleton";

export const RightBar = ({
  handleRightClick,
}: {
  handleRightClick: (id: number) => void;
}) => {
  const router = useRouter();
  const { setIsActivated } = useContext(SideBarContext);
  const { chats, user , fetchChats, Friends, setFriends} = useUser();

  function handleClick(id: number) {
    handleRightClick(id);
    setIsActivated(id);
  }

  const fetchFriends = async () => {
    try {
      console.log("fetching friends or No?");
      const friendsData = await FriendServices.getFriends();
      setFriends(friendsData.data);
    } catch (error: any) {
      console.log("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchFriends();
  }, []);

  return (
    <div className="hidden h-full w-3/4 flex-col items-center justify-start gap-7 transition-all duration-300 md:flex">
      <div className="costum-little-shadow flex h-full min-h-[300px] w-[80px] flex-col items-center justify-start gap-5 overflow-hidden rounded-[50px] bg-black-crd pt-3">
        <Link href="/Profile" onClick={() => handleClick(9)}>
          <Avatar className="size-[60px]">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_HOST}${user?.avatar}`}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex items-center justify-center">
          <Link href="/friends">
            <FaUsers
              onClick={() => handleClick(6)}
              className="size-10 text-[rgba(28,28,28,0.5)] transition-all duration-300 hover:text-aqua dark:text-white hover:dark:text-fire-red"
            />
          </Link>
        </div>
        <div className="custom-scrollbar-container flex size-full flex-col items-center gap-3">
          {Friends ? (
            Friends.length > 0 &&
            Friends.map((friend: Friend, index: number) => (
              <Avatar
                key={index}
                onClick={() => router.push(`/Profile/${friend.id}`)}
                className="size-[55px] cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
              >
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_HOST}${friend.avatar}`}
                  alt={friend.display_name || "User"}
                />
                <AvatarFallback>{friend.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))
          ) : (
            <Skeleton className="size-[60px] rounded-full bg-black-crd dark:bg-white-crd" />
          )}
        </div>
        <div className="costum-little-shadow flex h-full w-[80px] flex-col items-center justify-start gap-2 overflow-hidden rounded-[40px] bg-black-crd pt-4">
          <div className="flex items-center justify-center">
            <Link href="/messages">
              <FaComments
                onClick={() => handleClick(7)}
                className="size-10 text-[rgba(28,28,28,0.5)] transition-all duration-300 hover:text-aqua dark:text-white hover:dark:text-fire-red"
              />
            </Link>
          </div>
          <div className="custom-scrollbar-container flex size-full flex-col items-center gap-3">
            {chats &&
              chats.length > 0 &&
              chats.map((chat) => (
                <Avatar
                  onClick={() => router.push(`/messages/${chat.id}`)}
                  className="size-[60px] cursor-pointer rounded-full transition-transform duration-300 hover:scale-110"
                  key={chat.id}
                >
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_HOST}${chat.receiver.avatar}`}
                    alt={chat.receiver.username || "User"}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
