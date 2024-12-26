import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '../2fa/Button';
import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";

const BlockedComponent = ({
    name,
    ProfilePhoto,
}: {
    name: string;
    ProfilePhoto: string;
}) => {
  const [clicked, setClicked] = useState(false);
  function handleClick() {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2000);
  }
    return (
        <div className="h-[100px] w-full flex items-center justify-between border-b border-[#C4C4C4] lg:p-8 p-3">
            <div className="flex h-[75px] w-fit flex-row items-center justify-center sm:gap-8 gap-2 xl:gap-10">
          <Avatar className="sm:size-[65px] size-[56px] transition-all duration-300 md:size-[60px] lg:size-[75px]">
            <AvatarImage src={ProfilePhoto} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
            <h1 className="font-dayson text-[16px] sm:text-[18px] text-white opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[25px] dark:text-white opacity-[50%]">
              {name}
            </h1>
        </div>
          <div className="flex h-[80px] w-fit flex-col justify-center">
            <button className={` bg-[#00000026] text-white rounded-md w-[130px] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClick} >
              {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Unblock'}
            </button>
          </div>
        </div>
    );
};
export default BlockedComponent;