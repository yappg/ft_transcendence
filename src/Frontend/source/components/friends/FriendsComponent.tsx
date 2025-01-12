import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Achievement } from "@/constants/achivemement";
import { JSX } from "react";
const FriendsComponent = ({
  name,
  ProfilePhoto,
  level,
  messagesLink,
  customStyles = {},
  achievements = [],
  id,
}: {
  name: string;
  ProfilePhoto: string;
  level: number;
  wins?: number;
  losses?: number;
  messagesLink: JSX.Element;
  customStyles?: React.CSSProperties;
  achievements?: any[];
  id?: number;
}): JSX.Element => {
  const lastThreeAchievements = achievements.slice(0, 3);
  return (
    <div
      className="flex h-[100px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] bg-black-crd pl-2 sm:pl-4 lg:h-[150px] lg:px-5"
      style={{
        ...customStyles,
      }}
    >
      <div className="flex w-4/5 flex-row items-center justify-between xl:min-w-[900px]">
        <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-5 sm:gap-10 xl:gap-10">
          <Avatar className="size-[42px] transition-all duration-300 sm:size-[65px] md:size-[60px] lg:size-[75px]">
            <AvatarImage
              src={ProfilePhoto}
              onClick={() => {
                window.location.href = `/Profile/${id}`;
              }}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex h-[75px] w-fit flex-col justify-center">
            <h1 className="font-dayson text-[15px] text-white opacity-[90%] transition-all duration-300 dark:text-white sm:text-[15px] lg:text-[25px] xl:text-[27px] 2xl:text-[30px]">
              {name}
            </h1>
            <h1 className="font-poppins text-[10px] text-white opacity-[30%] transition-all duration-300 sm:text-[10px] md:text-[20px] xl:text-[25px]">
              level {level}
            </h1>
          </div>
        </div>
      </div>
      <div className="ml-[-20px] hidden flex-row items-center justify-center md:flex">
        {lastThreeAchievements && lastThreeAchievements.length === 3 ? (
          lastThreeAchievements.map((achievement, index) => (
            <img
              src={achievement.image}
              alt={achievement.name}
              key={index}
              width={60}
              height={60}
              className="rounded-full"
            />
          ))
        ) : (
          <div className="size-full bg-red-500"></div>
        )}
      </div>
      <div className="mr-[-20px] flex w-[23%] items-center justify-end">
        {messagesLink}
      </div>
    </div>
  );
};
export default FriendsComponent;
