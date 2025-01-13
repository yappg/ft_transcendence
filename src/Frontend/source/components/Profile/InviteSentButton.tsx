import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import FriendServices from "@/services/friendServices";
import { toast } from "@/hooks/use-toast";
export const InviteSentButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    try {
      FriendServices.cancelFriendRequest(name);
      setClicked(true);
      setThisState("none");
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Oups Somthing went wrong !",
        variant: "destructive",
        className: "bg-primary-dark border-none text-white",
        duration: 8000,
      });
    }
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  }
  return (
    <button
      className={`flex h-[30px] w-[170px] items-center justify-center rounded-[14px] bg-white font-poppins text-lg text-blue-500 shadow-2xl md:size-full lg:rounded-[30px]`}
      onClick={handleClick}
    >
      {clicked ? (
        <AiOutlineLoading className="animate-spin text-[20px] text-black" />
      ) : (
        "Cancel"
      )}
    </button>
  );
};
