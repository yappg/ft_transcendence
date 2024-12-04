import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaCommentDots } from 'react-icons/fa';
import Link from 'next/link';
const FriendsComponent = ({
  name,
  ProfilePhoto,
  level,
  wins,
  messagesLink,
  customStyles = {},
}: {
  name: string;
  ProfilePhoto: string;
  level: number;
  wins: number;
  messagesLink: JSX.Element;
  customStyles?: React.CSSProperties;
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
  return (
    <div 
    className="bg-black-crd flex h-[150px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] pl-4 lg:px-5"
    style={{
      ...customStyles,
    }}
  >
      <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-8 xl:gap-10">
        <Avatar className="size-[65px] transition-all duration-300 md:size-[70px] lg:size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] w-fit flex-col ">
          <h1 className="font-dayson text-[17px] dark:text-[#1C1C1C] text-white opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white">
            {name}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] transition-all duration-300 md:text-[20px] xl:text-[25px]">
            level {level}
          </h1>
        </div>
      </div>
      <div className="relative flex size-auto w-fit flex-row">
        {achievements.map((achievement, index) => (
          <Avatar
            key={index}
            className="-ml-[17px] size-[55px] transition-all duration-300 xl:size-[75px]"
          >
            <AvatarImage src={achievement.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="w-fit ">
        <h1 className="font-coustard text-[#28AFB0] transition-all duration-300 md:text-[17px] lg:text-[23px] xl:text-[26px] 2xl:text-[30px] dark:text-[#E43222]">
          Wins {wins}/70
        </h1>
      </div>
      <div className="flex items-center justify-center">
      {messagesLink}
      </div>
    </div>
  );
};
export default FriendsComponent;
