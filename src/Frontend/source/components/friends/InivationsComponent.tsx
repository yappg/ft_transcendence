import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GoCheckCircle } from "react-icons/go";


import { IoCloseCircleOutline } from 'react-icons/io5';

const InvitationsComponent = ({
  key,
  name,
  ProfilePhoto,
  sendAt,
}: {
  key: number;
  name: string;
  ProfilePhoto: string;
  sendAt: string;
}): JSX.Element => {
  return (
    <div className="bg-black-crd flex h-[150px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] px-4 lg:px-5">
      <div className="ml-11 flex h-[75px] flex-row items-center justify-center lg:gap-8 xl:gap-10 w-full md:gap-6">
        <Avatar className="size-[65px] transition-all duration-300 md:size-[70px] lg:size-[75px] ">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] w-fit flex-row items-center justify-center 2xl:gap-10 lg:gap-7 gap-4">
          <h1 className="font-dayson text-[17px] text-[#1C1C1C] opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white lg:w-[300px] md:w-[150px]">
            {name}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] transition-all duration-300 md:text-[20px] xl:text-[25px]">
            sent {sendAt}
          </h1>
        </div>
        <div className="xlgap-8 gap-4 ml-auto flex items-center justify-center">
          <button className="">
          <GoCheckCircle className='text-white h-[44px] w-[44px] opacity-[50%] hover:opacity-[100%] transition-all duration-300 dark:hover:text-[#E43222]'/>
          </button>
          <button className="">
            <IoCloseCircleOutline className='text-white h-[50px] w-[50px] opacity-[50%] hover:opacity-[100%] transition-all duration-300'/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationsComponent;
