import { useUser } from "@/context/GlobalContext";
import { History } from "@/context/GlobalContext";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
/* eslint-disable tailwindcss/no-custom-classname */
export const DashboardCard = ({
  playerMatches,
}: {
  playerMatches: History[];
}) => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="size-full rounded-[30px]">
        <h1 className="font-dayson text-2xl font-bold text-white">
          No data available
        </h1>
      </div>
    );
  }
  return (
    <>
      {playerMatches && playerMatches.length > 0 ? (
        <div className={`relative size-full overflow-hidden rounded-[30px]`}>
          <div
            className={`absolute inset-0 rounded-[30px] bg-cover bg-center ${
              playerMatches[0]?.map_played === "water"
                ? 'bg-[url("/WaterMode.svg")]'
                : playerMatches[0]?.map_played === "air"
                  ? 'bg-[url("/AirMode.svg")]'
                  : playerMatches[0]?.map_played === "earth"
                    ? 'bg-[url("/EarthMode.svg")]'
                    : playerMatches[0]?.map_played === "fire"
                      ? 'bg-[url("/FireMode.svg")]'
                      : ""
            }`}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative flex size-full items-center justify-between p-1 px-5">
            <Image
              src={playerMatches[0]?.player1.avatar}
              alt="avatar"
              className="size-[40px] rounded-full object-cover lg:size-[50px]"
              height={40}
              width={40}
              unoptimized
            />
            <div className="flex flex-col items-start justify-center gap-2">
              <h1 className="font-dayson text-sm text-white">
                {playerMatches[0]?.player1.display_name.slice(0, 7)}
              </h1>
              <h1 className="font-dayson text-sm text-green-500">
                {playerMatches[0]?.player1_score}
              </h1>
            </div>
            <h1 className="font-coustard text-[30px] text-white xl:text-[45px]">
              VS
            </h1>
            <div className="flex flex-col items-end justify-end gap-2">
              <h1 className="font-dayson text-sm text-white">
                {playerMatches[0]?.player2.display_name.slice(0, 7)}
              </h1>
              <h1 className="font-dayson text-sm text-red-500">
                {playerMatches[0]?.player2_score}
              </h1>
            </div>
            <Image
              src={playerMatches[0]?.player2.avatar}
              alt="avatar"
              className="size-[40px] rounded-full object-cover lg:size-[50px]"
              height={40}
              width={40}
              unoptimized
            />
            <RiArrowRightSLine className="font-dayson font-bold text-white sm:text-[80px] lg:text-[50px]" />
          </div>
        </div>
      ) : (
        <div className="flex size-full items-center justify-center rounded-[30px] bg-black-crd p-4">
          <h1 className="font-dayson text-lg text-white">No matches found</h1>
        </div>
      )}
    </>
  );
};
