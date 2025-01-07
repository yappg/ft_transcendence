import FriendServices from "@/services/friendServices";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
export const PendingButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClickAccept() {
    try {
      FriendServices.acceptFriendRequest(name);
      setClicked(true);
      setThisState("friend");
    } catch {
      console.log("error");
    }
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  }
  function handleClickDecline() {
    try {
      FriendServices.declineFriendRequest(name);
      setClicked(true);
      setThisState("none");
    } catch {
      console.log("error");
    }
  }
  return (
    <div className="flex size-full flex-row gap-7">
      <button
        className={`flex h-full w-1/2 items-center justify-center rounded-[14px] bg-red-500 font-dayson text-lg text-white shadow-2xl lg:rounded-[30px]`}
        onClick={handleClickDecline}
      >
        {clicked ? (
          <AiOutlineLoading className="animate-spin text-[20px] text-white" />
        ) : (
          "Decline"
        )}
      </button>
      <button
        className={` flex h-full w-1/2 items-center justify-center rounded-[14px] bg-green-400 font-dayson text-lg text-white shadow-2xl lg:rounded-[30px]`}
        onClick={handleClickAccept}
      >
        {clicked ? (
          <AiOutlineLoading className="animate-spin text-[20px] text-white" />
        ) : (
          "Accept"
        )}
      </button>
    </div>
  );
};
