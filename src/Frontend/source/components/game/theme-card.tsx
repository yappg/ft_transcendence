/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { MyButton } from '../generalUi/Button';
import { useRouter } from 'next/navigation';

interface MapCardsProps {
  title: string;
  description: string;
  imageUrl: string;
  height: string;
}

const MapsCard = ({
  title = 'Earth',
  description = 'in this mode the map could behave like earth sometime',
  imageUrl = '/image.png',
  url = '/game/earth',
  height = '480',
}) => {
  const router = useRouter();
  return (
    <div className="costum-little-shadow group relative size-full rounded-3xl overflow-hidden" style={{ height: `${height}px`, backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div
        className="absolute inset-0 overflow-hidden bg-[rgba(0,0,0,0.5)] transition-all duration-700 ease-in group-hover:bg-[rgba(0,0,0,0.7)]"
      >
        <div className="absolute inset-0 flex h-full flex-col justify-center p-8 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
          <p className="mb-6 text-lg text-gray-300">{description}</p>
          <div className="flex w-full justify-center lg:justify-start lg:pl-8">
            <MyButton className="min-w-[120px]" onClick={() => {router.push(`${url}`)}}>Select Map</MyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModesCard = ({
  title = 'Earth',
  description = 'in this mode the map could behave like earth sometime',
  imageUrl = '/image.png',
  url = '/game/earth',
  height = '480',
}) => {
  const router = useRouter();
  return (
    <div className="costum-little-shadow group relative w-[400px] h-full rounded-3xl overflow-hidden" style={{ height: `${height}px`, backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div
        className="absolute inset-0 overflow-hidden bg-[rgba(0,0,0,0.5)] transition-all duration-700 ease-in group-hover:bg-[rgba(0,0,0,0.7)]"
      >
        <div className="absolute inset-0 flex h-full flex-col justify-center p-8 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
          <p className="mb-6 text-lg text-gray-300">{description}</p>
          <div className="flex w-full justify-center lg:justify-start lg:pl-8">
            <MyButton className="min-w-[120px]" onClick={() => {router.push(`/Game-Arena/${url}`)}}>Select Map</MyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export {MapsCard, ModesCard};
