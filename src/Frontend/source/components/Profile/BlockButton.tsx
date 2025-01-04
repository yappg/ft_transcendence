import FriendServices from '@/services/friendServices';
import { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
export const BlockButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    try {
      FriendServices.blockFriend(name);
      setClicked(true);
      setThisState('blocked');
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
      className={` font-coustard flex w-[130px] justify-center rounded-md bg-red-300 py-2 text-white transition-all duration-300`}
      onClick={handleClick}
    >
      {clicked ? <AiOutlineLoading className="animate-spin text-[20px] text-white" /> : 'Block'}
    </button>
  );
};
