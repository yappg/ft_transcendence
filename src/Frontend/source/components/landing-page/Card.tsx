/* eslint-disable @next/next/no-img-element */
'use client';
import { MdLanguage } from 'react-icons/md';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const Card = () => {
  return (
    <div className="z-[2] flex  size-full flex-col justify-end">
      <div className="z-[3] mb-[-100px] flex h-[280px] w-full items-end justify-center md:mb-[-120px]">
        <img
          src="/landing-page-dark-logo.svg"
          alt="logo"
          className="hidden size-[200px] dark:block md:size-[235px] lg:size-[250px]"
        />
        <img
          src="/landing-page-logo.svg"
          alt="logo"
          className="size-[200px] dark:hidden md:size-[235px] lg:size-[250px]"
        />
      </div>
      <div className="flex h-5/6 w-full items-start justify-center">
        <div className="costum-shadow  flex size-full min-h-[650px] min-w-[400px] rounded-t-[30px] bg-[rgb(119,119,119,0.5)] dark:bg-[rgb(88,88,84,0.5)] md:size-[90%] md:max-h-[700px] md:max-w-[1200px] md:rounded-b-[30px]">
          {/* left side */}
          <div className="flex size-full flex-col justify-center px-6 pt-12 lg:w-3/4 lg:pl-12 lg:pr-0 lg:pt-8">
            <div className="absolute left-4 top-4 w-full md:relative md:left-0 md:top-0 md:flex md:items-end md:p-0">
              <div className="flex size-[50px] items-center justify-center rounded-md bg-[rgb(0,0,0,0.6)] text-white dark:bg-[rgb(0,0,0,0.5)] md:size-[65px]">
                <MdLanguage className="size-[35px] md:size-[45px]" />
              </div>
            </div>
            <div className="flex h-3/6 w-full items-center">
              <h1 className="font-coustard text-[45px] font-black text-[rgb(0,0,0,0.7)] dark:text-white md:text-[64px]">
                Start your own hallucinating ping pong journey
              </h1>
            </div>
            <div className="flex h-1/6 w-full items-start">
              <p className="font-coustard text-[25px] text-[rgb(0,0,0,0.5)] dark:text-white md:text-[32px]">
                welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal
              </p>
            </div>
            <div
              className={`flex h-2/6 w-full items-center justify-center md:h-1/6 md:items-center md:justify-start`}
            >
              {/* to replace with button */}
              <Link href={'/auth/login'} className={`${buttonVariants()} rounded-full`}>
                Explore
              </Link>
            </div>
          </div>
          {/* right side */}
          <div className="hidden w-2/4 lg:flex ">
            <img src="/racket.svg" alt="racket" className="w-[90%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
