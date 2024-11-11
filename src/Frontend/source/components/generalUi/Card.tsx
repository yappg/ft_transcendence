/* eslint-disable tailwindcss/no-custom-classname */
import React, { ReactNode } from 'react';
import { Interface } from 'readline';

interface cardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: cardProps) => {
  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div
      className={`${className} bg-white-crd costum-big-shadow dark:bg-secondary
      flex h-screen min-h-[515px] flex-col items-center justify-center
      rounded-t-[30px] p-4 md:rounded-b-[30px]`}
    >
      {children}
    </div>
  );
};

export default Card;
