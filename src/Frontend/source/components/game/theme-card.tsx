/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { MyButton } from '../generalUi/Button';
import { useRouter } from 'next/navigation';

interface GameCardProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  height: string;
}

const MapsCard = ({ title, description, imageUrl, url, height }: GameCardProps) => {
  const router = useRouter();
  return (
    <div
      className="costum-little-shadow group relative size-full overflow-hidden rounded-3xl"
      style={{
        height: `${height}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 overflow-hidden bg-black-crd transition-all duration-700 ease-in group-hover:bg-[rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 flex h-full flex-col justify-center p-8 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
          <p className="mb-6 text-lg text-gray-300">{description}</p>
          <div className="flex w-full justify-center lg:justify-start lg:pl-8">
            <MyButton
              className="min-w-[120px]"
              onClick={() => {
                router.push(`${url}`);
              }}
            >
              Select Map
            </MyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ModesCardProps {
  title: string;
  description: string;
  url: string;
  height: string;
}

const ModesCard = ({ title, description, url, height }: ModesCardProps) => {
  const router = useRouter();
  return (
    <div
      className="costum-little-shadow group relative size-full overflow-visible rounded-3xl bg-black py-[20px] transition-all duration-700 ease-in-out hover:bg-[rgb(70,70,70)]"
      style={{
        height: `${height}px`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex h-full flex-col items-start justify-between gap-4 p-8 opacity-100">
        <div className="flex h-1/2 w-full items-center justify-center overflow-hidden rounded-md bg-[rgb(70,70,70)]">
          <img src="Avatar.svg" alt="" className="size-[50px]" />
        </div>
        <div className="size-full">
          <h2 className="mb-4 text-4xl font-bold text-[rgb(200,200,200)]">{title}</h2>
          <p className="mb-6 text-lg text-[rgb(180,180,180)]">{description}</p>
        </div>
        <div className="flex w-full justify-end lg:pl-8">
          <MyButton
            className="min-w-[120px]"
            onClick={() => {
              router.push(`${url}`);
            }}
          >
            Select Map
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export { MapsCard, ModesCard };
