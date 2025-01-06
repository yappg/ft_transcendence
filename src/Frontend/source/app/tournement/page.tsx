"use client";
import React from "react";
import Tournament from "./tournament";

const App = () => {
  // Mock images for players (can be replaced with backend data)
  const playerImages = [
    "./Avatar.svg",
    "./Avatar.svg",
    "./logo.svg",
    "./logo.svg",
  ];

  // Function to create a single-elimination tree dynamically
  const createTree = (
    players: any,
  ): { data: { player: string }; right?: any; left?: any } => {
    if (players.length === 1) {
      // Base case: single player as winner
      return { data: { player: players[0] } };
    }

    const mid = Math.floor(players.length / 2);
    return {
      data: { player: "Winner" },
      right: createTree(players.slice(0, mid)), // Right subtree
      left: createTree(players.slice(mid)), // Left subtree
    };
  };

  const myTree = createTree(playerImages);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-gradient dark:bg-linear-gradient-dark">
      <Tournament myTree={myTree} />
    </div>
  );
};

export default App;
