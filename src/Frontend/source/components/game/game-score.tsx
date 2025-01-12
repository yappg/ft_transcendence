/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
"use client";

import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGame, Player } from "@/context/GameContext";
import { useEffect, useState } from "react";
import { RoundsProps } from "@/context/GameContext";
import { Skeleton } from "../ui/skeleton";

const PlayerScore = ({
  player,
  score,
  isme,
}: {
  player: Player | null;
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
            className={`size-full max-h-[35px] max-w-[35px] bg-black-crd md:max-h-[50px] md:max-w-[50px] lg:max-h-[75px] lg:max-w-[75px]`}
          >
            <AvatarImage src={player.avatar} alt="avatar" />
            <AvatarFallback className="bg-black-crd text-[10px]">
              CN
            </AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="size-full max-h-[35px] max-w-[35px] rounded-full bg-black-crd dark:bg-white-crd md:max-h-[50px] md:max-w-[50px]" />
        )}
      </div>
      <div
        className={`flex w-[100px] text-center font-dayson text-[10px] dark:text-white lg:w-[150px] xl:text-[15px]`}
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

const ScoreTable = ({ mode }: { mode: string }) => {
  const game = useGame();
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);
  // const p1 = game.player1;
  // const p2 = game.player2;

  useEffect(() => {
    setP1(game.player1);
    setP2(game.player2);
    console.log("players:", game.player1, game.player2);
  }, [game.player1, game.player2]);

  useEffect(() => {
    if (game.GameScore[0] > 6 || game.GameScore[1] > 6) {
      const newRound = {
        round: game.Rounds.length + 1,
        winner:
          game.GameScore[0] > game.GameScore[1]
            ? game.player1?.username
            : game.player2?.username,
        score: game.GameScore,
      };

      game.setRounds((prevRounds: RoundsProps[]) => {
        const updatedRounds = [...prevRounds, newRound];
        return updatedRounds as RoundsProps[];
      });

      game.setGameScore([0, 0]);
      game.GameScore = [0, 0];
    }
    if (game.GameState === "over") {
      console.log("game over scoretable");
      if (game.totalScore[0] > game.totalScore[1]) {
        game.setGameWinner(game.player1);
        // game.GameWinner = game.player1;
      } else {
        console.log("player2:", game.player2);
        game.setGameWinner(game.player2);
        // game.GameWinner = game.player2;
      }
      console.log("game over scoretable 2");
    }
  }, [game.GameScore]);

  useEffect(() => {
    if (mode === "tournament" && game.GameState === "over" && game.GameWinner) {
      console.log("game winner:", game.GameWinner, game.tournamentMatch);
      if (game.tournamentMatch === 0) {
        game.TournementTree.right.data.player = game.GameWinner;
        game.setGameWinner(null);
      } else if (game.tournamentMatch === 1) {
        game.TournementTree.left.data.player = game.GameWinner;
        game.setGameWinner(null);
      } else if (game.tournamentMatch === 2) {
        game.TournementTree.data.player = game.GameWinner;
        game.setTournamentMatch(0);
        game.setGameWinner(null);
      }
      game.setRounds(() => []);
    }
  }, [game.GameWinner]);

  return (
    <div className="relative flex size-full items-center justify-around gap-1 px-8 xl:flex-col xl:gap-8">
      <div className="absolute left-2 top-2 flex h-[60px] w-auto items-center justify-start font-dayson text-[48px] dark:text-white xl:w-full">
        <Link href={"/games"}>
          {mode !== "tournament" && (
            <IoIosArrowBack className="size-[20px] md:size-[60px]" />
          )}
        </Link>
        <span className="hidden xl:block"> Game Arena</span>
      </div>

      <div className="flex size-full flex-col items-center justify-center gap-2">
        <div className="flex w-full items-center justify-around gap-4 p-2 font-dayson text-[20px] dark:text-white md:text-[35px]">
          <PlayerScore player={p1} score={game.GameScore[0]} isme={true} />
          <div className="flex h-full w-[100px] items-center justify-center rounded-[10px] border-2 border-white-crd p-2 text-center text-[10px] text-white-crd">
            {game.GameState === "start" ? (
              <div className="flex xl:flex-col">
                <h1>Round</h1>
                <h3>{game.Rounds.length + 1}</h3>
              </div>
            ) : game.GameState === "over" ? (
              <div>
                {mode === "tournament"
                  ? "game over"
                  : `Winner :\n${game.GameWinner?.username}`}
              </div>
            ) : (
              <div>get ready</div>
            )}
          </div>
          <PlayerScore player={p2} score={game.GameScore[1]} isme={false} />
        </div>

        <div className="hidden h-fit w-full items-end justify-between rounded-[10px] bg-black-crd xl:flex">
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
