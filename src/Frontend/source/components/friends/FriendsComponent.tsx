import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JSX } from "react";
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
      name: "Achievement 1",
      icon: "/ach1.svg",
    },
    {
      name: "Achievement 2",
      icon: "/ach1.svg",
    },
    {
      name: "Achievement 3",
      icon: "/ach1.svg",
    },
  ];
  return (
    <div
      className="flex h-[70px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] bg-black-crd pl-2 sm:pl-4 lg:h-[150px] lg:px-5"
      style={{
        ...customStyles,
      }}
    >
      <div className="flex w-4/5 flex-row items-center justify-between xl:min-w-[900px]">
        <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-2 sm:gap-8 xl:gap-10">
          <Avatar className="size-[42px] transition-all duration-300 sm:size-[65px] md:size-[60px] lg:size-[75px]">
            <AvatarImage src={ProfilePhoto} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex h-[75px] w-fit flex-col justify-center">
            <h1 className="font-dayson text-[8px] text-white opacity-[90%] transition-all duration-300 dark:text-white sm:text-[15px] lg:text-[25px] xl:text-[27px] 2xl:text-[30px]">
              {name}
            </h1>
            <h1 className="font-poppins text-[5px] text-white opacity-[30%] transition-all duration-300 sm:text-[2px] md:text-[15px] xl:text-[25px]">
              level {level}
            </h1>
          </div>
        </div>
        <div className="relative flex size-auto w-fit flex-row">
          {achievements.map((achievement, index) => (
            <Avatar
              key={index}
              className="ml-[-10px] size-[20px] transition-all duration-300 sm:ml-[-17px] sm:size-[40px] lg:size-[50px] xl:size-[75px]"
            >
              <AvatarImage src={achievement.icon} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="mr-[-20px] flex w-[23%] items-center justify-end">
        {messagesLink}
      </div>
    </div>
  );
};
export default FriendsComponent;
