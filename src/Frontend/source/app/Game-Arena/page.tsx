/* eslint-disable tailwindcss/classnames-order */
"use client";

import React from "react";
import GameTable from "@/components/game/game-arena";
import { useSearchParams } from "next/navigation";
import { GameProvider } from "@/context/GameContext";
import ScoreTable from "@/components/game/game-score";

const GameArena = () => {
  const searchParams = useSearchParams();
  const map = searchParams.get("map");
  const mode = searchParams.get("mode");
  const game_id = searchParams.get("game_id");

  return (
    <GameProvider>
      <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-auto flex-col xl:gap-8 xl:px-8 lg:flex-row">
        <div className="h-[100px] lg:h-full w-full xl:w-auto flex justify-center items-center">
          <ScoreTable mode={mode || ""} map={map || ""}></ScoreTable>
        </div>
        {/* game table */}
        <div className="size-full flex items-center justify-center">
          <div className="size-full overflow-hidden max-w-[calc(3*(100vh-200px)/4)] lg:max-w-[calc(280vh/4)] xl:w-5/6 justify-center items-center flex">
            {/* still one bug in small screens when width is smaller than height need to limit height */}
            <GameTable mode={mode || ""} map={map || ""} game_id={game_id || ""} />
          </div>
        </div>
        {/* abilities */}
        <div className="col-start-7 col-end-8 h-[100px] bg-black"></div>
      </div>
    </GameProvider>
  );
};

export default GameArena;
