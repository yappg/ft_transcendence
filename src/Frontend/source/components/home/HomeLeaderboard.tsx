import Link from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";
import { LeaderBoard, useUser } from "@/context/GlobalContext";
import Image from "next/image";
export const HomeLeaderboard = ({
  playerLeaderBoard,
}: {
  playerLeaderBoard: LeaderBoard[];
}) => {
  const { user } = useUser();
  return (
    <div className="flex size-full flex-col items-start justify-start rounded-[30px] bg-black-crd py-3 absolute">
      <div className="flex h-[85%] w-full flex-col items-start justify-start overflow-hidden">
        {playerLeaderBoard?.slice(0, 3).map((leaderboard, index) => (
          <div
            key={index}
            className={`flex w-full flex-1 items-start justify-start gap-4 border-b-2 px-3 pt-3 lg:gap-8 ${index === 0 ? "" : "flex md:hidden lg:flex"} ${index > 2 ? "hidden" : ""}`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_HOST}${leaderboard.avatar}`}
              alt="avatar"
              className="size-[40px] rounded-full object-cover lg:size-[50px]"
              width={40}
              height={40}
              unoptimized={true}
            />
            <div className="flex flex-col items-start justify-center lg:gap-4">
              <h1 className="font-dayson text-sm text-white lg:text-[20px]">
                {leaderboard.display_name.length > 10
                  ? leaderboard.display_name.slice(0, 13)
                  : leaderboard.display_name}
              </h1>
              <h1 className="font-poppins font-bold text-sm text-white opacity-50 lg:text-[20px]">
                level {leaderboard.level}
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-[15%] w-full items-center justify-end p-4">
        <h1 className="text-center font-dayson text-sm text-white">
          Leaderboard
        </h1>
        <Link
          href={"/LeaderBoard"}
          className="flex size-[30px] items-center justify-center lg:size-[30px] 2xl:size-[50px]"
        >
          <RiArrowRightSLine className="font-dayson text-[20px] font-bold text-white lg:text-[80px] 2xl:text-[40px]" />
        </Link>
      </div>
    </div>
  );
};
