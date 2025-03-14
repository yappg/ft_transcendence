/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, Suspense } from "react";
import GameTable from "@/components/game/game-arena";
import { Player, useGame } from "@/context/GameContext";
import ScoreTable from "@/components/game/game-score";
import { useUser } from "@/context/GlobalContext";
import { useSearchParams } from "next/navigation";

const LoadingComponent = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>Loading game arena...</div>
    </div>
  );
};

// export const dynamic = 'force-dynamic'
const GameArenaContent = () => {
  const game = useGame();
  const user = useUser();

  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  const mode = searchParams.get('mode');
  const game_id = searchParams.get("game_id");

  useEffect(() => {
    if (!user?.user) {
      user.fetchCurrentUserDetails();
      return;
    }
    if (mode === "tournament") {
      if (game.tournamentMatch === 0) {
        game.setPlayer1(game.TournementTree.right.right.data.player);
        game.setPlayer2(game.TournementTree.right.left.data.player);
      } else if (game.tournamentMatch === 1) {
        game.setPlayer1(game.TournementTree.left.right.data.player);
        game.setPlayer2(game.TournementTree.left.left.data.player);
      } else {
        game.setPlayer1(game.TournementTree.right.data.player);
        game.setPlayer2(game.TournementTree.left.data.player);
      }
    } else if (mode === "one-vs-one") {
        if (user.user?.username && user?.user?.avatar) {
          game.setPlayer1({
            username: user?.user?.username,
            avatar: process.env.NEXT_PUBLIC_HOST + user?.user?.avatar,
          } as Player);
        }
        if (game?.opponent?.username && game?.opponent?.avatar) {
          game.setPlayer2({
            username: game.opponent?.username,
            avatar: game.opponent?.avatar,
          } as Player);
        }
    } else {
      game.setPlayer1({
        username: "player1",
        avatar: "/air.png",
      } as Player);
      game.setPlayer2({
        username: "player2",
        avatar: "/earth.png",
      } as Player);
      console.log("setting default players", game.player1, game.player2);
    }
  }, [mode, user, game.opponent, game.TournementTree]);

  return (
    <div className="flex h-screen w-full flex-col bg-linear-gradient dark:bg-linear-gradient-dark xl:flex-row xl:gap-8 xl:px-8">
      <div className="flex h-[100px] w-full items-center justify-center xl:h-full xl:w-1/2">
        <ScoreTable mode={mode || ""}></ScoreTable>
      </div>
      {/* game table */}
      <div className="flex size-full items-center justify-center lg:p-8 xl:w-1/2">
        <div className="flex size-full max-w-[calc(3*(100vh-130px)/4)] items-center justify-center overflow-hidden xl:max-w-[calc(280vh/4)]">
          <GameTable
            mode={mode || ""}
            map={map || ""}
            game_id={game_id || ""}
          />
        </div>
      </div>
    </div>
  );
};

const GameArena = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <GameArenaContent />
    </Suspense>
  );
};

export default GameArena;
