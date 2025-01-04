import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Achievments = ({
    achievements,
} :
{
    achievements: any[]
}) => {
    return (      <div className="w-full lg:h-[100px] h-[70px] flex flex-row items-center gap-3 overflow-hidden p-5 xl:p-2">
    {achievements.map((achievement, index) => (
      <Avatar
        key={index}
        className="lg:size-[65px] transition-all duration-300 xl:size-[80px] sm:size-[70px] size-[50px]"
      >
        <AvatarImage src={process.env.NEXT_PUBLIC_HOST + achievement.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ))}
  </div>);
}
