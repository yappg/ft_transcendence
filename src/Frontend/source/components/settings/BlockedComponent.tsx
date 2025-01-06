import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "../2fa/Button";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import FriendServices from "@/services/friendServices";
import { chatService } from "@/services/chatService";
import { useUser } from "@/context/GlobalContext";
/* eslint-disable tailwindcss/no-custom-classname */
const BlockedComponent = ({
  name,
  ProfilePhoto,
  callback,
}: {
  name: string;
  ProfilePhoto: string;
  callback: () => void;
}) => {
  const [clicked, setClicked] = useState(false);
  const { setChats } = useUser();
  const refreshData = async () => {
    const chats = await chatService.getChatList();
    setChats(chats);
    if (callback) {
      callback();
    }
  };

  async function handleClick() {
    setClicked(true);
    try {
      await FriendServices.unblockFriend(name);
      refreshData();
    } catch (error) {
      console.error("Error unblocking user:", error);
    } finally {
      setClicked(false);
    }
  }
  return (
    <div className="flex h-[100px] w-full items-center justify-between border-b border-[#C4C4C4] p-3 lg:p-8">
      <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-2 sm:gap-8 xl:gap-10">
        <Avatar className="size-[56px] transition-all duration-300 sm:size-[65px] md:size-[60px] lg:size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="font-dayson text-[16px] text-white opacity-[50%] opacity-[90%] transition-all duration-300 dark:text-white sm:text-[18px] lg:text-[25px] xl:text-[27px] 2xl:text-[25px]">
          {name}
        </h1>
      </div>
      <div className="flex h-[80px] w-fit flex-col justify-center">
        <button
          className={`font-coustard flex w-[130px] justify-center rounded-md bg-[#00000026] py-2 text-white transition-all duration-300`}
          onClick={handleClick}
        >
          {clicked ? (
            <AiOutlineLoading className="animate-spin text-[20px] text-white" />
          ) : (
            "Unblock"
          )}
        </button>
      </div>
    </div>
  );
};
export default BlockedComponent;
