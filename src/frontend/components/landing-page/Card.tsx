/* eslint-disable @next/next/no-img-element */
import exp from 'constants';
import { MdLanguage } from 'react-icons/md';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const Karta = () => {
  return (
    <div className="z-[2] flex  size-full flex-col justify-end">
      <div className="z-[3] mb-[-100px] flex h-[280px] w-full items-end justify-center md:mb-[-120px]">
        <img
          src="/landing-page-logo.svg"
          alt="logo"
          className="size-[200px] md:size-[235px] lg:size-[250px]"
        />
      </div>
      <div className="flex h-5/6 w-full items-start justify-center">
        <div className="flex size-full min-h-[650px] min-w-[400px] rounded-t-[30px] bg-[rgb(88,88,84,0.5)] md:size-[90%] md:max-h-[700px] md:max-w-[1200px] md:rounded-b-[30px]">
          {/* left side */}
          <div className="flex size-full flex-col justify-center px-6 pt-12 lg:w-3/4 lg:pl-12 lg:pr-0 lg:pt-8">
            <div className="absolute left-4 top-4 w-full md:relative md:left-0 md:top-0 md:flex md:items-end md:p-0">
              <div className="flex size-[50px] items-center justify-center rounded-md bg-[rgb(0,0,0,0.5)] md:size-[65px]">
                <MdLanguage className="size-[35px] md:size-[45px]" />
              </div>
            </div>
            <div className="flex h-3/6 w-full items-center">
              <h1 className="text-[45px] font-bold md:text-[55px]">
                Start your own hallucinating ping pong journey
              </h1>
            </div>
            <div className="flex h-1/6 w-full items-start">
              <p className="text-[25px] md:text-[30px]">
                welcome to PiPo lorem ipsum ipsum lorem hehe makayn maytgal
              </p>
            </div>
            <div className="flex h-2/6 w-full items-center justify-center md:h-1/6 md:items-center md:justify-start">
              {/* to replace with button */}
              <Link
                className={`${buttonVariants()} h-[60px] w-[200px] rounded-2xl bg-[#C1382C] text-[36px]`}
                href={'/login'}
              >
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

export default Karta;
