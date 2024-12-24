/* eslint-disable tailwindcss/no-custom-classname */
import React, { ReactNode } from 'react';

interface cardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: cardProps) => {
  return (
    <div
      className={`${className} bg-white-crd costum-big-shadow dark:bg-secondary
      flex w-full flex-col items-center justify-center
      rounded-t-[30px] p-4 md:min-h-[515px] md:rounded-b-[30px] lg:rounded-[30px]`}
    >
      {children}
    </div>
  );
};

export default Card;
