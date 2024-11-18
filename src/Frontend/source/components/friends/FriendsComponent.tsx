import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaCommentDots } from 'react-icons/fa';
const FriendsComponent = ({
  key,
  name,
  ProfilePhoto,
  level,
  wins,
}: {
  key: number;
  name: string;
  ProfilePhoto: string;
  level: number;
  wins: number;
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
    <div className="bg-side-bar flex h-[150px] w-full flex-row items-center gap-[500px] border-b-2 border-[#1C1C1C] border-opacity-[40%] px-14">
      <div className="flex h-[75px] w-auto flex-row items-center justify-center gap-10">
        <Avatar className="size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] flex-col">
          <h1 className="font-coustard text-[28px] font-black text-[#1C1C1C] opacity-[90%] dark:text-white">
            {name}
          </h1>
          <h1 className="font-coustard text-[25px] text-white opacity-[30%]">level {level}</h1>
        </div>
      </div>
      <div className="relative flex size-auto flex-row">
        {achievements.map((achievement, index) => (
          <Avatar key={index} className="-ml-[17px] size-[75px] ">
            <AvatarImage src={achievement.icon} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="">
        <h1 className="font-coustard font-regular dark:text[#E43222] text-[30px] text-[#28AFB0]">
          Wins {wins}/70
        </h1>
      </div>
      <FaCommentDots className="text-[#1C1C1C] size-[300px]" />
    </div>
  );
};
export default FriendsComponent;
