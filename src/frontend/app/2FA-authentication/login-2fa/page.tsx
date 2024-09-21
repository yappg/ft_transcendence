import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/2fa/Card';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import Button from '@/components/2fa/Button';

export default function LoginTFA() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center gap-100">
      <Card>
        <h1 className=" text-white md:text-[70px] transition-all duration-300 text-[40px] font-days-one flex items-center justify-center">
          activate 2FA
        </h1>
        <Image
          src="/QRcode.svg"
          alt="2fa"
          width={250}
          height={250}
          className=" md:w-[350px] md:h-[350px] transition-all duration-300"
        />
        <InputOTPDemo />
        <div className="flex flex-col items-center mt-20 md:mt-0 justify-center gap-[20px] md:gap-[40px]">
          <Button />
          <a href="#" className="font-coustard text-[#C1382C]">
            Skip this step
          </a>
        </div>
      </Card>
    </div>
  );
}
{
  /* <div
      className="flex items-center justify-center"
      style={{ height: '100vh', backgroundColor: 'black' }}
    ></div> */
}
