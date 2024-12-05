import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserActivityBoard from './UserActivityBoard';
const UserSummary = () => {
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
    <div className="size-full bg-[#242627]">
      <div className="h-full w-[65%] flex border-2 items-start justify-start flex-col ">
        <div className="w-full h-[20%] flex flex-row gap-3 px-8 py-3">
          {achievements.map((achievement, index) => (
            <Avatar
              key={index}
              className="size-[55px] transition-all duration-300 xl:size-[80px] bg-blue-600"
            >
              <AvatarImage src={achievement.icon} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="border-2 h-[80%] w-full flex items-center justify-between px-12">
          <div className="h-full w-[45%] bg-black rounded-[50px] shadow-2xl"></div>
          <div className="h-full w-[45%] bg-white rounded-[50px] shadow-2xl"></div>
        </div>
      </div>
      {/* <div className="h-full w-[35%] flex items-center justify-center border-2"></div> */}
    </div>
  );
};
export default UserSummary;
