/* eslint-disable @next/next/no-img-element */
import React from 'react';

const EarthModeCard = ({
  title = 'Earth',
  description = 'in this mode the map could behave like earth sometime',
  imageUrl = '',
  height = '480',
}) => {
  return (
    <div className="group relative size-[350px]" style={{ height: `${height}px` }}>
      {/* Card Container */}
      <div
        className="costum-big-shadow absolute inset-0 overflow-hidden rounded-3xl transition-all duration-700 
                    ease-in group-hover:opacity-0"
      >
        {/* Default State */}
        <img src={imageUrl} alt={title} className="size-full object-cover" />
      </div>

      {/* Hover State */}
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
          <button
            className="absolute bottom-6 right-1/2 w-fit rounded-lg bg-[rgba(255,255,255,0.1)]
            px-6 py-2 text-white backdrop-blur-sm transition-all duration-200  hover:bg-[rgba(255,255,255,0.2)]"
          >
            play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarthModeCard;
