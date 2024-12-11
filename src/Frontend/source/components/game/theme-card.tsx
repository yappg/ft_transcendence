/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { MyButton } from '../generalUi/Button';

const EarthModeCard = ({
  title = 'Earth',
  description = 'in this mode the map could behave like earth sometime',
  imageUrl = '/image.png',
  height = '480',
}) => {
  return (
    <div className="group relative size-[350px]" style={{ height: `${height}px` }}>
      <div
        className="costum-big-shadow absolute inset-0 overflow-hidden rounded-3xl transition-all duration-700 
                    ease-in group-hover:opacity-0"
      >
        <img src={imageUrl} alt={title} className="size-full object-cover" />
      </div>
      <div
        className="absolute inset-0 overflow-hidden rounded-3xl bg-[rgba(0,0,0,0.7)] 
        opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100"
      >
        <div className="flex size-full flex-col">
          {/* Background Image (darker version) */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute left-0 top-0 size-full object-cover brightness-50"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex h-full flex-col justify-center p-8">
            <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
            <p className="mb-6 text-lg text-gray-300">{description}</p>
            {/* Play Now Button */}
          </div>
          <MyButton>play now</MyButton>
        </div>
      </div>
    </div>
  );
};

export default EarthModeCard;
