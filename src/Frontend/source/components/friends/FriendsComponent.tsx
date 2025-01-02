import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JSX } from 'react';
const FriendsComponent = ({
  name,
  ProfilePhoto,
  level,
  messagesLink,
  customStyles = {},
}: {
  name: string;
  ProfilePhoto: string;
  level: number;
  wins?: number;
  losses?: number;
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
      className="bg-black-crd flex lg:h-[150px] h-[70px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] sm:pl-4 lg:px-5 pl-2"
      style={{
        ...customStyles,
      }}
    >
      <div className="w-[80%] xl:min-w-[900px] flex flex-row justify-between items-center">
        <div className="flex h-[75px] w-fit flex-row items-center justify-center sm:gap-8 gap-2 xl:gap-10">
          <Avatar className="sm:size-[65px] size-[42px] transition-all duration-300 md:size-[60px] lg:size-[75px]">
            <AvatarImage src={ProfilePhoto} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex h-[75px] w-fit flex-col justify-center">
            <h1 className="font-dayson text-[8px] sm:text-[15px] text-white opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white">
              {name}
            </h1>
            <h1 className="font-coustard text-[5px] sm:text-[2px] text-white opacity-[30%] transition-all duration-300 md:text-[15px] xl:text-[25px]">
              level {level}
            </h1>
          </div>
        </div>
        <div className="relative flex size-auto w-fit flex-row">
          {achievements.map((achievement, index) => (
            <Avatar
              key={index}
              className="sm:-ml-[17px] -ml-[10px] sm:size-[40px] size-[20px] lg:size-[50px] transition-all duration-300 xl:size-[75px]"
            >
              <AvatarImage src={achievement.icon} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end w-[23%] -mr-[20px]">{messagesLink}</div>
    </div>
  );
};
export default FriendsComponent;
