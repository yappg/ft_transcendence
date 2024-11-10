/* eslint-disable @next/next/no-img-element */
import React from 'react';

function Title() {
  return (
    <div className="flex h-auto w-3/4 flex-col justify-center lg:w-5/6">
      <div className="mb-[-15px] flex size-full h-[35px] gap-4 pl-2 md:mb-[-20px] md:h-[40px]">
        <img src="/google.svg" alt="google" className="h-full" />
        <img src="/42.svg" alt="google" className=" h-full py-[0.35rem]" />
      </div>
      <div className="h-4/6 font-coustard text-[35px] font-black dark:text-white sm:text-[40px]">
        <h1 className="h-[60px] text-[3.5rem] sm:text-[4rem] md:h-[80px] md:text-[4.5rem]">
          Authenticate
        </h1>
        <h1>
          <span>your </span>
          <span className="text-[#284F50] dark:text-my-red">account</span>
        </h1>
      </div>
    </div>
  );
}

export default Title;
