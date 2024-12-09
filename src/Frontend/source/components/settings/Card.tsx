import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
export const Card = ({
  title,
  Icon,
  path,
}: {
  title: string;
  Icon: React.ReactNode;
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
    <div className="w-full h-[16.6%] bg-[#00000026] border-t-[2px] border-r-[2px] border-black">
      <button
        className="size-full flex items-center justify-start gap-11 px-12"
        onClick={handleFilter}
      >
        <Icon size={30} color="white" />
        <h1 className="text-white font-dayson">{title}</h1>
      </button>
    </div>
  );
};
