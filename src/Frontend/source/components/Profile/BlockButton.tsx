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
  }
  return (
    <button
      className={`font-dayson flex h-[30px] w-[170px] items-center justify-center rounded-[14px] bg-[#080E7E] text-lg text-white shadow-2xl md:size-full lg:rounded-[30px]`}
      onClick={handleClick}
    >
      {clicked ? <AiOutlineLoading className="animate-spin text-[20px] text-white" /> : 'Block'}
    </button>
  );
};
