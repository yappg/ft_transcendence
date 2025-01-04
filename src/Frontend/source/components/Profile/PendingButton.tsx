import FriendServices from '@/services/friendServices';
import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
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
      setThisState('friend');
    } catch {
      console.log('error');
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
      setThisState('none');
    } catch {
      console.log('error');
    }
  }
  return (
    <div className="size-full gap-2">
      <button
        className={` font-coustard flex w-[50%] justify-center rounded-md bg-red-200 py-2 text-white shadow-2xl transition-all duration-300`}
        onClick={handleClickDecline}
      >
        {clicked ? <AiOutlineLoading className="animate-spin text-[20px] text-white" /> : 'Decline'}
      </button>
      <button
        className={` font-coustard flex w-[50%] justify-center rounded-md bg-[#00000026] py-2 text-white transition-all duration-300`}
        onClick={handleClickAccept}
      >
        {clicked ? <AiOutlineLoading className="animate-spin text-[20px] text-white" /> : 'Accept'}
      </button>
    </div>
  );
};
