'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGame } from '@/context/GameContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { TreeGenerator } from 'tournament-bracket-tree';
import 'tournament-bracket-tree/dist/index.css';

const mapTournamentToNode = (game: any) => {
  console.log("node passed: ", game.player.avatar);
  return (
    <div
      className="w-[60px] h-[60px] lg:w-[77px] lg:h-[77px]
                "
    >
      {game.player.avatar.startsWith('./') ? (
        <div className='flex flex-col items-center justify-center gap-2'>
          <img src={game.player.avatar} alt="Player" className="rounded-full object-cover w-full h-full border border-white" />
          <h2>{game.player.nickname}</h2>
        </div>
      ) : (
        <div className="empty-circle size-full">
          <Skeleton className="size-full bg-black-crd dark:bg-white-crd rounded-full" />
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
  console.log("My Tree: ", game.TournementTree);

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
    <div className='h-screen w-full mg:rounded-2xl bg-black-crd p-4 flex justify-around items-center flex-col'>
      <div className='size-auto md:h-auto w-full flex justify-center items-center'>
        <h1 className='text-black-crd dark:text-white-crd text-2xl md:text-3xl font-bold text-center'>Tournament</h1>
      </div>
      <div
        className={`flex size-full justify-center ${
          isMobile ? 'flex-col' : 'flex-row'
        } size-auto`}
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
          className="flex md:flex-col items-center w-full md:w-auto md:h-full justify-center"
        >
          <img src="./games-logo.svg" className="size-[100px]"></img>
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
      <div className='size-auto md:h-[100px] w-full flex justify-center items-center'>
        <div
          className='w-[120px] h-[50px] md:w-[200px] md:h-[60px] rounded-md bg-primary dark:bg-primary-dark flex items-center justify-center text-white'
          onClick={() => { router.push(`/Game-Arena?mode=tournament&map=${map}`) }}
        >
          next Match
        </div>
      </div>
    </div>
  );
};

export default Tournament;
