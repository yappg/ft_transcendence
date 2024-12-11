/* eslint-disable @next/next/no-img-element */
'use client';
import EarthModeCard from '@/components/game/theme-card';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';
import { useEffect } from 'react';
const Game_modes = () => {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(2);
  }, [setIsActivated]);
  return (
    <div className="col-start-2 col-end-12 row-start-2 row-end-10 flex flex-col px-3 py-2">
      <div className="z-10 mb-[-100px] flex h-[200px] items-center justify-center">
        <img src="/games-logo.svg" alt="" className="size-[300px]" />
      </div>
      <div className="custom-inner-shadow costum-little-shadow relative flex h-full items-center overflow-hidden rounded-[30px] bg-black-crd">
        <div className="flex w-[calc(100%+100px)] gap-5 overflow-hidden py-10">
          <div className="scroll-container">
            <EarthModeCard height="100px" imageUrl="/earth.png" />
            <EarthModeCard height="100px" imageUrl="/air.png" />
            <EarthModeCard height="100px" imageUrl="/fire.png" />
            <EarthModeCard height="100px" imageUrl="/water.png" />
            <EarthModeCard height="100px" imageUrl="/earth.png" />
            <EarthModeCard height="100px" imageUrl="/air.png" />
            <EarthModeCard height="100px" imageUrl="/fire.png" />
            <EarthModeCard height="100px" imageUrl="/water.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game_modes;
