import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
export const Card = ({
  title,
  Icon,
  path,
}: {
  title: string;
  Icon: IconType;
  path: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleFilter() {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    currentParams.set('field', path);
    router.push(`?${currentParams.toString()}`);
  }
  return (
    <div className="w-full h-[16.6%] bg-[#00000026] border-t-[2px] border-r-[2px] border-black hover:bg-[#000000] transition-all duration-300">
      <button
        className="size-full items-center justify-start gap-11 px-12"
        onClick={handleFilter}
      >
        <Icon className="size-[30px]" color="white" />
        <h1 className="text-white font-dayson xl:flex hidden">{title}</h1>
      </button>
    </div>
  );
};
