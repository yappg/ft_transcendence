"use client";

import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser, User } from "@/context/GlobalContext";
import { useGame } from "@/context/GameContext";
import { useEffect } from "react";
import { RoundsProps } from "@/context/GameContext";
import { Skeleton } from "../ui/skeleton";
/* eslint-disable tailwindcss/no-custom-classname */
const PlayerScore = ({
  player,
  score,
  isme,
}: {
  player: User | null;
  score: number;
  isme: boolean;
}) => {
  return (
    <div
      className={`flex h-full w-auto items-start ${isme ? "" : "items-end"} flex-col gap-1`}
    >
      <div className="flex size-[50px] items-center justify-center md:size-[60px]">
        {player ? (
          <Avatar
            className={`size-full max-h-[35px] max-w-[35px] bg-black-crd md:max-h-[50px] md:max-w-[50px]`}
          >
            <AvatarImage src="/Avatar.svg" alt="avatar" />
            <AvatarFallback className="bg-black-crd text-[10px]">
              CN
            </AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="size-full max-h-[35px] max-w-[35px] rounded-full bg-black-crd dark:bg-white-crd md:max-h-[50px] md:max-w-[50px]" />
        )}
      </div>
      <div
        className={`text-center'} flex w-[100px] font-poppins text-[10px] dark:text-white lg:w-[150px] xl:text-[15px]`}
      >
        <div className={`${isme ? "" : "order-3"} h-[10px] w-full`}>
          {player ? (
            <p className={`${isme ? "" : "text-end"} `}>{player.username}</p>
          ) : (
            <Skeleton className="size-full rounded-md bg-black-crd dark:bg-white-crd" />
          )}
        </div>
        <div className={`w-full text-center text-white-crd`}>{score}</div>
      </div>
    </div>
  );
};

const ScoreTable = ({ mode, map }: { mode: string; map: string }) => {
  const { user } = useUser();
  const game = useGame();

  useEffect(() => {
    if (mode) {
      if (game.GameScore[0] > 6 || game.GameScore[1] > 6) {
        const newRound = {
          round: game.Rounds.length + 1,
          winner:
            game.GameScore[0] > game.GameScore[1] ? "Player 1" : "Player 2",
          score: game.GameScore,
        };

        game.setRounds((prevRounds: RoundsProps[]) => {
          const updatedRounds = [...prevRounds, newRound];
          return updatedRounds as RoundsProps[];
        });

        game.setGameScore([0, 0]);
        game.GameScore = [0, 0];
      }
    }
  }, [game, mode]);

  return (
    <div className="relative flex size-full items-center justify-around gap-1 px-8 xl:flex-col xl:gap-8">
      <Link
        href={"#"}
        className="absolute left-2 top-2 flex h-[60px] w-auto items-center justify-start font-dayson text-[48px] dark:text-white xl:w-full"
      >
        <IoIosArrowBack className="size-[20px] md:size-[60px]" />{" "}
        <span className="hidden lg:block">Game Arena</span>
      </Link>

      <div className="flex size-full flex-col items-center justify-center gap-2">
        <div className="gap-15 flex w-full items-center justify-around p-2 font-dayson text-[20px] dark:text-white md:text-[35px]">
          {game && (
            <PlayerScore player={user} score={game.GameScore[0]} isme={true} />
          )}
          <div className="flex h-full w-[100px] items-center justify-center rounded-[10px] border-2 border-white-crd p-2 text-center text-[10px] text-white-crd">
            {game && game.GameState === "start" ? (
              <div className="flex lg:flex-col">
                <h1>Round</h1>
                <h3>{game.Rounds.length + 1}</h3>
              </div>
            ) : game.GameState === "over" ? (
              // <div className="flex size-full flex-col items-center justify-center border-white border-2 rounded-[10px]">
              <div>game over</div>
            ) : (
              <div>get ready</div>
            )}
          </div>
          {game && mode && mode.indexOf("local") === -1 ? (
            <PlayerScore
              player={game.opponent}
              score={game.GameScore[1]}
              isme={false}
            />
          ) : (
            game && (
              <PlayerScore
                player={{ username: "player2" } as User}
                score={game.GameScore[1]}
                isme={false}
              />
            )
          )}
        </div>

        <div className="hidden h-fit w-full items-end justify-between rounded-[10px] bg-black-crd lg:flex">
          {/* rounds  */}
          <div className="flex size-full h-[200px] flex-col items-center justify-start overflow-auto">
            <div className="flex h-[50px] w-full items-center justify-around border-b border-black-crd text-[18px] text-black-crd dark:border-white-crd dark:text-white-crd">
              <div className="flex h-full w-1/3 items-center justify-center">
                {"Round"}
              </div>
              <div className="flex h-full w-1/3 items-center justify-center border-l border-black-crd dark:border-white-crd">
                {"Winner"}
              </div>
              <div className="flex h-full w-1/3 items-center justify-center border-l border-black-crd dark:border-white-crd">
                {"score"}
              </div>
            </div>
            {game &&
              game.Rounds.map((round, index) => (
                <div
                  key={index}
                  className={`flex h-[50px] w-full items-center justify-around ${index == 2 ? "" : "border-b border-black-crd dark:border-white-crd"} text-[18px] text-black-crd dark:text-white-crd`}
                >
                  <div className="flex h-full w-1/3 items-center justify-center">{`${round.round}`}</div>
                  <div className="flex h-full w-1/3 items-center justify-center border-l border-black-crd dark:border-white-crd">{`${round.winner}`}</div>
                  <div className="flex h-full w-1/3 items-center justify-center border-l border-black-crd dark:border-white-crd">{`${round.score[0]}/${round.score[1]}`}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
