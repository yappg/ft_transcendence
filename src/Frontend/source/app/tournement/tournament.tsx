"use client";
/* eslint-disable tailwindcss/no-custom-classname */
import { MyButton } from "@/components/generalUi/Button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { TreeGenerator } from "tournament-bracket-tree";
import "tournament-bracket-tree/dist/index.css";

const mapTournamentToNode = (game: any) => {
  return (
    <div className="m-2 flex size-[60px] items-center justify-center rounded-full border border-[#FFFFFF] md:m-[3px] lg:m-[14px] lg:size-[77px]">
      {game.player.startsWith("./") ? (
        <Image
          src={game.player}
          alt="Player"
          className="size-full rounded-full object-cover"
          height={100}
          width={100}
        />
      ) : (
        <div className="empty-circle size-full">
          <Skeleton className="size-full rounded-full bg-black-crd dark:bg-white-crd" />
        </div>
      )}
    </div>
  );
};

const Tournament = ({ myTree }: any) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="mg:rounded-2xl flex h-screen w-full flex-col items-center justify-around bg-black-crd p-4">
      <div className="flex size-auto w-full items-center justify-center md:h-[100px]">
        <h1 className="text-center text-2xl font-bold text-black-crd dark:text-white-crd md:text-3xl">
          Tournament
        </h1>
      </div>
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} size-auto`}>
        {/* Right Tree */}
        <TreeGenerator
          root={isMobile ? "bottom" : "right"}
          mapDataToNode={mapTournamentToNode}
          tree={myTree.right}
          lineThickness={1}
          lineColor="rgba(255, 255, 255, 0.5)"
          lineLength={32}
        />

        {/* Final Match Node */}
        <div
          style={{
            margin: isMobile ? "10px 0" : "0 10px",
          }}
          className="flex w-full items-center justify-center md:h-full md:w-auto md:flex-col"
        >
          <Image
            src="./games-logo.svg"
            className="size-[100px]"
            height={100}
            width={100}
            alt={""}
          ></Image>
          {mapTournamentToNode(myTree.data)}
        </div>

        <TreeGenerator
          root={isMobile ? "top" : "left"}
          mapDataToNode={mapTournamentToNode}
          tree={myTree.left}
          lineThickness={1}
          lineColor="rgba(255, 255, 255, 0.5)"
          lineLength={35}
        />
      </div>
      <div className="flex size-auto w-full items-center justify-center md:h-[100px]">
        <MyButton>Start Tournament</MyButton>
      </div>
    </div>
  );
};

export default Tournament;
