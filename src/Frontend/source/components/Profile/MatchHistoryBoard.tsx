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
    <div className="flex flex-row-reverse items-center justify-between text-white h-[80px] 2xl:px-4 md:px-2 px-1 overflow-hidden border-b-2 border-white border-opacity-[40%]">
      <div className="w-fit h-full flex flex-row-reverse justify-start items-center 2xl:gap-3 gap-2">
        <Avatar className="2xl:size-[60px] xl:size-[40px] md:size-[30px] sm:size-[60px] size-[50px]">
          <AvatarImage src={`http://localhost:8080${Profile}`} />
          <AvatarFallback>OT</AvatarFallback>
        </Avatar>
        <p className="xl:text-[12px] text-[10px] font-dayson text-white">
          {name.length > 10 ? name.slice(0, 10) + '' : name}
        </p>
      </div>
      <div className="flex h-full w-fit items-center justify-center">
        <p
          className={`2xl:text-[17px] xl:text-[11px] md:text-[11px] sm:text-[18px] text-[14px] font-dayson ${
            Player1score < Player2score ? 'text-[#C1382C]' : 'text-[#5FB2AD]'
          }`}
        >
          {Player1score < Player2score
            ? `Defeat (${Player1score} - ${Player2score})`
            : `Victory (${Player2score} - ${Player1score})`}
        </p>
      </div>
    </div>
  );
};
export default MatchHistoryBoard;
