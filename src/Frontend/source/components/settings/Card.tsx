import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
export const Card = ({ title, Icon, path }: { title: string; Icon: IconType; path: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleFilter() {
    if (!path) {
      return;
    }
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('field', path);
    router.push(`?${currentParams.toString()}`);
  }
  return (
    <div className="w-full h-full border-b-[2px] border-r-[2px] border-black hover:bg-[#000000] transition-all duration-300">
      <button
        className="size-full items-center lg:justify-start justify-center gap-11 p-0 lg:px-12 flex"
        onClick={handleFilter}
      >
        <Icon
          style={{
            height: '30px',
            width: '30px',
          }}
          color="white"
        />
        <h1 className="text-white font-dayson xl:block hidden">{title}</h1>
      </button>
    </div>
  );
};
