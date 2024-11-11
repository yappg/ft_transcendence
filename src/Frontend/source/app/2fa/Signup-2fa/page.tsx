'use client';

import React from 'react';
import Image from 'next/image';
import Card from '@/components/generalUi/Card';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import { MyButton } from '@/components/generalUi/Button';

export default function LoginTFA() {
  const myString = 'Submit';
  const [value, setValue] = React.useState('');

  const handleClick = () => {
    if (value == '000000') alert('2FA activated successfully');
    else alert('Invalis OTP');
  };
  return (
    <div className=" w-full h-screen bg-[#13191D] flex items-start p-0 xl:pt-[5%] justify-center overflow-auto">
      <Card
        className="size-full lg:h-full lg:w-full xl:h-[90%] xl:w-[90%] 2xl:w-[80%] 2xl:max-w-[1200px] tfa-card-bg xl:rounded-[50px] shadow-2xl 
      md:min-h-[1000px] flex flex-col items-center justify-center transition-all gap-4"
      >
        <div className="md:w-[85%] md:h-[90%] h-auto w-auto flex flex-col  items-center justify-center gap-10">
          <h1 className=" text-white text-lg md:text-[70px] transition-all duration-300 text-[40px]  font-dayson flex items-center justify-center">
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
            <MyButton
              onClick={handleClick}
              className="w-[201px] h-[68px] md:w-[301px] md:h-[88px] md:text-[36px] 
      text-[24px] font-coustard font-black transition-all duration-300 rounded-lg"
            >
              {myString}
            </MyButton>
            <a href="#" className="font-coustard text-[#C1382C]">
              Skip this step
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
