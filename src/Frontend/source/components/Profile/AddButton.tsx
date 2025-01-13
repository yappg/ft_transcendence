/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
import FriendServices from "@/services/friendServices";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";

export const AddButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  async function handleClick() {
    try {
      await FriendServices.sendFriendRequest(name);
      setClicked(true);
      setThisState("sent_invite");
    } catch (error: any) {
      console.log("error: cannot add friend");
    }
  }

  return (
    <button
      className="flex h-[30px] w-[170px] items-center justify-center rounded-[14px] bg-blue-500 font-dayson text-lg text-white shadow-2xl md:size-full lg:rounded-[30px]"
      onClick={handleClick}
    >
      {clicked ? (
        <AiOutlineLoading className="animate-spin text-[20px] text-white" />
      ) : (
        "Add Friend"
      )}
    </button>
  );
};
