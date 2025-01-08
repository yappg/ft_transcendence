/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import GameTable from "@/components/game/game-arena";
import { useParams, useSearchParams } from "next/navigation";
import { GameProvider } from "@/context/GameContext";
import ScoreTable from "@/components/game/game-score";

const GameArena = () => {
  const params = useSearchParams();
  const map = params.get("map") as string;
  const mode = params.get("mode") as string;
  const game_id = params.get("game_id") as string;

  if (!params) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <input placeholder="Search..." />
      </React.Suspense>
    );
  }
  return (
    <GameProvider>
      <div className="flex h-screen w-auto flex-col bg-linear-gradient dark:bg-linear-gradient-dark lg:flex-row xl:gap-8 xl:px-8">
        <div className="flex h-[100px] w-full items-center justify-center lg:h-full xl:w-auto">
          <ScoreTable mode={mode || ""} map={map || ""}></ScoreTable>
        </div>
        {/* game table */}
        <div className="flex size-full items-center justify-center">
          <div className="flex size-full max-w-[calc(3*(100vh-200px)/4)] items-center justify-center overflow-hidden lg:max-w-[calc(280vh/4)] xl:w-5/6">
            {/* still one bug in small screens when width is smaller than height need to limit height */}
            <GameTable
              mode={mode || ""}
              map={map || ""}
              game_id={game_id || ""}
            />
          </div>
        </div>
        {/* abilities */}
        <div className="col-start-7 col-end-8 h-[100px] bg-black"></div>
      </div>
    </GameProvider>
  );
};

export default GameArena;
