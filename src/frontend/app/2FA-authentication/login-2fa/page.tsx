'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/2fa/Card';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import Button from '@/components/2fa/Button';

export default function LoginTFA() {
  const myString = 'Submit';
  const [value, setValue] = React.useState('');

  const handleClick = () => {
    if (value == '000000') alert('2FA activated successfully');
    else alert('Invalis OTP');
  };
  return (
    <div className="w-full h-screen bg-[#13191D] flex items-start p-0 xl:pt-[5%] justify-center overflow-auto">
      <Card style="min-h-[1000px] flex flex-col items-center justify-center transition-all gap-4">
        <div className="md:w-[85%] md:h-[90%] h-auto w-auto flex flex-col  items-center justify-center gap-10">
          <h1 className=" text-white text-lg md:text-[70px] transition-all duration-300 text-[40px] font-days-one flex items-center justify-center">
            activate 2FA
          </h1>
          <Image
            src="/QRcode.svg"
            alt="2fa"
            width={250}
            height={250}
            className=" md:w-[350px] md:h-[350px] transition-all duration-300"
          />
          <InputOTPDemo value={value} setValue={setValue} />
          <div className="flex flex-col items-center mt-20 md:mt-0 justify-center gap-[20px] md:gap-[40px] md:w-full md:h-[">
            <Button value={myString} onClick={handleClick} />
            <a href="#" className="font-coustard text-[#C1382C]">
              Skip this step
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
