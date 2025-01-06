import FriendServices from "@/services/friendServices";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export const UnBlockButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    try {
      FriendServices.unblockFriend(name);
      setClicked(true);
      setThisState("none");
    } catch {
      console.log("error");
    }
  }
  return (
    <button
      className={`flex size-full items-center justify-center rounded-[14px] bg-[#4C4D4E75] font-dayson text-lg text-white shadow-2xl lg:rounded-[30px]`}
      onClick={handleClick}
    >
      {clicked ? (
        <AiOutlineLoading className="animate-spin text-[20px] text-white" />
      ) : (
        "Unblock"
      )}
    </button>
  );
};
