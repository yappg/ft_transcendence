/* eslint-disable @next/next/no-img-element */
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGame } from '@/context/GameContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { TreeGenerator } from 'tournament-bracket-tree';
import 'tournament-bracket-tree/dist/index.css';

const mapTournamentToNode = (game: any) => {
  console.log('node passed: ', game.player.avatar);
  return (
    <div
      className="size-[60px] lg:size-[77px]
                "
    >
      {game.player.avatar.startsWith('./') ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src={game.player.avatar}
            alt="Player"
            className="size-full rounded-full border border-white object-cover"
          />
          <h2>{game.player.username}</h2>
        </div>
      ) : (
        <div className="size-full">
          <Skeleton className="size-full rounded-full bg-black-crd dark:bg-white-crd" />
        </div>
      )}
    </div>
  );
};

const Tournament = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const game = useGame();
  const searchParams = useSearchParams();
  const map = searchParams.get('map');
  console.log('My Tree: ', game.TournementTree);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="mg:rounded-2xl flex h-screen w-full flex-col items-center justify-around bg-black-crd p-4">
      <div className="flex size-auto w-full items-center justify-center md:h-auto">
        <h1 className="text-center text-2xl font-bold text-black-crd dark:text-white-crd md:text-3xl">
          Tournament
        </h1>
      </div>
      <div
        className={`flex size-full justify-center ${isMobile ? 'flex-col' : 'flex-row'} size-auto`}
      >
        {/* Right Tree */}
        <TreeGenerator
          root={isMobile ? 'bottom' : 'right'}
          mapDataToNode={mapTournamentToNode}
          tree={game.TournementTree.right}
          lineThickness={1}
          lineColor="rgba(255, 255, 255, 0.5)"
          lineLength={32}
        />

        {/* Final Match Node */}
        <div
          style={{
            margin: isMobile ? '10px 0' : '0 10px',
          }}
          className="flex w-full items-center justify-center md:h-full md:w-auto md:flex-col"
        >
          <img src="./games-logo.svg" alt="avatar" className="size-[100px]"></img>
          {mapTournamentToNode(game.TournementTree.data)}
        </div>

        <TreeGenerator
          root={isMobile ? 'top' : 'left'}
          mapDataToNode={mapTournamentToNode}
          tree={game.TournementTree.left}
          lineThickness={1}
          lineColor="rgba(255, 255, 255, 0.5)"
          lineLength={35}
        />
      </div>
      <div className="flex size-auto w-full items-center justify-center md:h-[100px]">
        <div
          className="flex h-[50px] w-[120px] items-center justify-center rounded-md bg-primary text-white dark:bg-primary-dark md:h-[60px] md:w-[200px]"
          onClick={() => {
            router.push(`/Game-Arena?mode=tournament&map=${map}`);
          }}
        >
          next Match
        </div>
      </div>
    </div>
  );
};

export default Tournament;
