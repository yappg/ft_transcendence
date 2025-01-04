import FriendServices from '@/services/friendServices';
import { AiOutlineLoading } from 'react-icons/ai';
import { useState } from 'react';

export const AddButton = ({
  name,
  setThisState,
}: {
  name: string;
  setThisState: (state: string) => void;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    try {
      FriendServices.sendFriendRequest(name);
      setClicked(true);
      setThisState('sent_invite');
    } catch (error: any) {
      console.log('error', error);
    }
  }
  return (
    <button
      className="font-dayson flex size-full items-center justify-center rounded-[14px] bg-[#4C4D4E] text-lg text-white shadow-2xl lg:rounded-[30px]"
      onClick={handleClick}
    >
      {clicked ? (
        <AiOutlineLoading className="animate-spin text-[20px] text-white" />
      ) : (
        'Add Friend'
      )}
    </button>
  );
};
