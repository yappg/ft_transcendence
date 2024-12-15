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
    <div className="flex flex-row-reverse items-start justify-start text-white h-[80px] 2xl:px-6 md:px-4 sm:px-7 overflow-hidden border-b-2 border-white border-opacity-[40%]">
      <div className="2xl:w-[300px] md:w-[200px] sm:w-[300px] h-full flex flex-row-reverse justify-start items-center 2xl:gap-8 sm:gap-5">
        <Avatar className="2xl:size-[70px] md:size-[50px] sm:size-[70px]">
          <AvatarImage src={Profile} />
          <AvatarFallback>OT</AvatarFallback>
        </Avatar>
        <p className="2xl:text-[20px] md:text-[14px] text-[20px] font-dayson text-white">{name}</p>
      </div>
      <div className="2xl:w-[300px] md:w-[150px] sm:w-[150px] h-full flex items-center justify-center">
        <p
          className={`2xl:text-[17px] md:text-[14px] sm:text-[18px] font-dayson ${
            Player1score > Player2score ? 'text-[#C1382C]' : 'text-[#5FB2AD]'
          }`}
        >
          {Player1score > Player2score
            ? `Defeat (${Player1score} - ${Player2score})`
            : `Victory (${Player2score} - ${Player1score})`}
        </p>
      </div>
    </div>
  );
};
export default MatchHistoryBoard;
