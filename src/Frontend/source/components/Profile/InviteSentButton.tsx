import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import FriendServices from '@/services/friendServices';
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
      setThisState('none');
    } catch {
      console.log('error');
    }
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  }
  return (
    <button
      className={` font-coustard flex w-[130px] justify-center rounded-md bg-green-500 py-2 text-white transition-all duration-300`}
      onClick={handleClick}
    >
      {clicked ? <AiOutlineLoading className="animate-spin text-[20px] text-white" /> : 'Cancel'}
    </button>
  );
};
