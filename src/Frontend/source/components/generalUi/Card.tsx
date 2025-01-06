/* eslint-disable tailwindcss/no-custom-classname */
import React, { ReactNode } from "react";

interface cardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: cardProps) => {
  return (
    <div
      className={`${className} costum-big-shadow flex w-full flex-col items-center justify-center rounded-t-[30px] bg-white-crd p-4 dark:bg-secondary md:min-h-[515px] md:rounded-b-[30px] lg:rounded-[30px]`}
    >
      {children}
    </div>
  );
};

export default Card;
