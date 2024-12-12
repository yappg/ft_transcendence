import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const MatchHistoryBoard = ({
  name,
  Profile,
  Player1score,
  Player2score,
}: {
  name: string;
  Profile: string;
  Player1score: number;
  Player2score: number;
}) => {
  return (
    <div className="flex flex-row-reverse items-start justify-start text-white h-[80px] 2xl:px-6 lg:px-4 overflow-hidden border-b-2 border-white border-opacity-[40%]">
      <div className="w-[300px] h-full flex flex-row-reverse justify-start border-2 items-center gap-8">
        <Avatar className="2xl:size-[70px] xl:size-[60px]">
          <AvatarImage src={Profile} />
          <AvatarFallback>OT</AvatarFallback>
        </Avatar>
          <p className="2xl:text-[20px] lg:text-[15px]  font-dayson text-white">{name}</p>
      </div>
      <div className='w-[300px] h-full flex items-start justify-center'>
        <p className="2xl:text-[20px] lg:text-[15px]  font-dayson text-white">{Player1score > Player2score ? "Defeat" : "Victory"}</p>
      </div>
    </div>
  );
};
export default MatchHistoryBoard;
