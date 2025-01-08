/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Achievments = ({ achievements }: { achievements: any[] }) => {
  return (
    <div className="flex h-[70px] w-full flex-row items-center gap-3 overflow-x-scroll p-5 scrollbar-hide lg:h-[100px] xl:p-2">
      <div className="flex w-fit animate-loop-scroll gap-2">
        {achievements.map((achievement, index) => (
          <Avatar
            key={index}
            className="size-[50px] bg-black-crd transition-all duration-300 sm:size-[70px] lg:size-[65px] xl:size-[80px]"
          >
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_HOST}${achievement.image}`}
            />
            <AvatarFallback>{`A${index + 1}`}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
};
