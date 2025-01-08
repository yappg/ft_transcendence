import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Achievments = ({ achievements }: { achievements: any[] }) => {
  return (
    <div className="flex h-[70px] w-full flex-row items-center gap-3 overflow-hidden p-5 lg:h-[100px] xl:p-2">
      {achievements.map((achievement, index) => (
        <Avatar
          key={index}
          className="size-[50px] transition-all duration-300 sm:size-[70px] lg:size-[65px] xl:size-[80px]"
        >
          <AvatarImage
            src={`${process.env.NEXT_PUBLIC_HOST}${achievement.image}`}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};
