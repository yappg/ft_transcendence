import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
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
    <div className="flex h-[80px] flex-row-reverse items-center justify-between overflow-hidden border-b-2 border-white border-opacity-[40%] px-1 text-white md:px-2 2xl:px-4">
      <div className="flex h-full w-fit flex-row-reverse items-center justify-start gap-2 2xl:gap-3">
        <Avatar className="size-[50px] sm:size-[60px] md:size-[30px] xl:size-[40px] 2xl:size-[60px]">
          <AvatarImage src={`http://localhost:8080${Profile}`} />
          <AvatarFallback>OT</AvatarFallback>
        </Avatar>
        <p className="font-dayson text-[10px] text-white xl:text-[12px]">
          {name.length > 10 ? name.slice(0, 10) + "" : name}
        </p>
      </div>
      <div className="flex h-full w-fit items-center justify-center">
        <p
          className={`font-dayson text-[14px] sm:text-[18px] md:text-[11px] xl:text-[11px] 2xl:text-[17px] ${
            Player1score < Player2score ? "text-[#C1382C]" : "text-[#5FB2AD]"
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
