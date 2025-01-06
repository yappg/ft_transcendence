'use client';

import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import React, { useEffect } from 'react';

export const EditProfile = ({ setThisState }: { setThisState: (state: string) => void }) => {
  useEffect(() => {
    setThisState('self');
  }, [setThisState]);
  return (
    <Link
      href={'/settings'}
      className="absolute right-4 top-4 flex size-fit items-center justify-center rounded-[10px] bg-[#B7B7B7]  p-1 lg:static"
    >
      <HiOutlinePencilSquare size={30} color="black" />
    </Link>
  );
};
