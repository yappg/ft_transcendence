import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { invitations } from '@/constants/InvitationsList';
import { GoCheckCircle } from 'react-icons/go';

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
  const achievements = [
    {
      name: 'Achievement 1',
      icon: '/ach1.svg',
    },
    {
      name: 'Achievement 2',
      icon: '/ach1.svg',
    },
    {
      name: 'Achievement 3',
      icon: '/ach1.svg',
    },
  ];
  function handleClick() {
    console.log('clicked');
  }
  return (
    <div className="bg-black-crd flex h-[150px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] px-10 xl:px-16 2xl:px-28">
      <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-8 xl:gap-10">
        <Avatar className="size-[65px] transition-all duration-300 md:size-[70px] lg:size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] w-fit flex-col ">
          <h1 className="font-dayson text-[17px] text-[#1C1C1C] opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white">
            {name}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] transition-all duration-300 md:text-[20px] xl:text-[25px]">
            sent {sendAt}
          </h1>
        </div>
      </div>
      <div className="relative flex size-auto w-fit flex-row">
        {achievements.map((achievement) => (
          <Avatar
            key={key}
            className="-ml-[17px] size-[55px] transition-all duration-300 xl:size-[75px]"
          >
            <AvatarImage src={achievement.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex w-[200px] items-center justify-center gap-4 pr-12 xl:gap-8">
        <button onClick={handleClick}>
          <GoCheckCircle className="size-[44px] text-white opacity-[50%] transition-all duration-300 hover:opacity-[100%] dark:hover:text-[#E43222]" />
        </button>
        <button onClick={handleClick}>
          <IoCloseCircleOutline className="size-[50px] text-white opacity-[50%] transition-all duration-300 hover:opacity-[100%]" />
        </button>
      </div>
    </div>
  );
};

export default InvitationsComponent;
