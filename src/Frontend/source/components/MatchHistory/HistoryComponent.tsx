import PlayerCard from "@/components/MatchHistory/PlayerCardComponent";
import { JSX } from "react";
/* eslint-disable tailwindcss/no-custom-classname */
const MatchHistoryComponent = ({
  Player1,
  Player2,
  ProfilePhoto1,
  ProfilePhoto2,
  level1,
  level2,
  Score1,
  Score2,
  map_played,
}: {
  Player1: string;
  Player2: string;
  ProfilePhoto1: string;
  ProfilePhoto2: string;
  level1: number;
  level2: number;
  Score1: number;
  Score2: number;
  map_played: string;
}): JSX.Element => {
  const truncateUsername = (username: string) => {
    return username.length > 10 ? `${username.slice(0, 10)}` : username;
  };

  const getBackgroundStyle = () => {
    if (map_played === "fire") {
      return {
        backgroundImage: 'url("/FireMode.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (map_played === "air" || map_played === "Air") {
      return {
        backgroundImage: 'url("/AirMode.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (map_played === "earth" || map_played === "Earth") {
      return {
        backgroundImage: 'url("/EarthMode.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (map_played === "water" || map_played === "Water") {
      return {
        backgroundImage: 'url("/WaterMode.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  return (
    <div className="relative flex h-[100px] w-full flex-row items-center gap-3 border-b-2 border-[#1C1C1C] border-opacity-[40%] bg-black-crd px-4 md:h-[150px] lg:px-5">
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={getBackgroundStyle()}
      />
      <div className="relative z-10 flex w-full flex-row items-center gap-3">
        <PlayerCard
          profilePhoto={ProfilePhoto1}
          playerName={truncateUsername(Player1)}
          level={level1}
          score={Score1}
          reverse={false}
          isHighScore={Score1 > Score2}
        />
        <div className="flex h-full w-[10%] items-center justify-center">
          <h1 className="font-dayson text-[#CFCDCD] transition-all duration-300 md:text-[32px] lg:text-[35px] xl:text-[43px] 2xl:text-[50px]">
            VS
          </h1>
        </div>
        <PlayerCard
          profilePhoto={ProfilePhoto2}
          playerName={truncateUsername(Player2)}
          level={level2}
          score={Score2}
          reverse={true}
          isHighScore={Score2 > Score1}
        />
      </div>
    </div>
  );
};

export default MatchHistoryComponent;
