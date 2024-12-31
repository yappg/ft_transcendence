'use client';

import { MyButton } from '@/components/generalUi/Button';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';
import { TreeGenerator } from 'tournament-bracket-tree';
import 'tournament-bracket-tree/dist/index.css';

const mapTournamentToNode = (game: any) => {
  return (
    <div
      className="m-2 md:m-[3px] w-[60px] h-[60px] lg:w-[77px] lg:h-[77px] lg:m-[14px]
                flex justify-center items-center border border-[#FFFFFF] rounded-full"
    >
      {game.player.startsWith('./') ? (
        <img src={game.player} alt="Player" className="rounded-full object-cover w-full h-full" />
      ) : (
        <div className="empty-circle size-full">
          <Skeleton className="size-full bg-black-crd dark:bg-white-crd rounded-full" />
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='h-screen w-full mg:rounded-2xl bg-black-crd p-4 flex justify-around items-center flex-col'>
      <div className='size-auto md:h-[100px] w-full flex justify-center items-center'>
        <h1 className='text-black-crd dark:text-white-crd text-2xl md:text-3xl font-bold text-center'>Tournament</h1>
      </div>
      <div
        className={`flex ${
          isMobile ? 'flex-col' : 'flex-row'
        } size-auto`}
      >
        {/* Right Tree */}
        <TreeGenerator
          root={isMobile ? 'bottom' : 'right'}
          mapDataToNode={mapTournamentToNode}
          tree={myTree.right}
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
          {mapTournamentToNode(myTree.data)}
        </div>

        <TreeGenerator
          root={isMobile ? 'top' : 'left'}
          mapDataToNode={mapTournamentToNode}
          tree={myTree.left}
          lineThickness={1}
          lineColor="rgba(255, 255, 255, 0.5)"
          lineLength={35}
        />
      </div>
      <div className='size-auto md:h-[100px] w-full flex justify-center items-center'>
        <MyButton>Start Tournament</MyButton>
      </div>
    </div>
  );
};

export default Tournament;
