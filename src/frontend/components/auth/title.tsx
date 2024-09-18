/* eslint-disable @next/next/no-img-element */
import React from 'react';

function Title() {
  return (
    <div className="flex h-auto flex-col justify-end">
      <div className="flex h-1/6 w-full gap-4 pl-4">
        <img src="/google.svg" alt="google" className="size-[50px]" />
        <img src="/42.svg" alt="google" className="size-[50px]" />
      </div>
      <div className="h-auto w-full font-coustard font-bold">
        <h1 className="h-[50px] text-start text-[50px] text-white md:h-[80px] md:text-[80px]">
          Authorization
        </h1>
        <h1 className="text-[30px] md:text-[45px]">
          of your <span className="text-my-red">account</span>
        </h1>
      </div>
    </div>
  );
}

export default Title;
