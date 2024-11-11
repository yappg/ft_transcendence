'use client';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import React from 'react';
import Card from '@/components/generalUi/Card';
import { useRouter } from 'next/navigation';
import { MyButton } from '@/components/generalUi/Button';
export default function SignupTFA() {
  const [value, setValue] = React.useState('');
  const myString = 'Go >';
  const router = useRouter();
  const handleClick = () => {
    if (value == '000000') 
      {
        alert('2FA activated successfully');
       router.push('/Home');
      }
    else alert('Invalis OTP');
  };
  return (
    <div className="w-full h-screen bg-[#13191D] flex items-start justify-center overflow-auto bg-linear-gradient dark:bg-linear-gradient-dark">
      <Card className="size-full lg:h-full lg:w-full xl:h-[60%] xl:mt-[10%] xl:w-[90%] 2xl:w-[80%] 2xl:max-w-[1200px] xl:rounded-[50px] shadow-2xl md:min-h-[500px] transition-all gap-8">
        <div className="flex flex-col items-start justify-center transition-all">
          <h1 className="text-3xl dark:text-white text-black font-dayson opacity-80 sm:text-5xl transition-all duration-300 ">
            2FA Code Required
          </h1>
        </div>
        <InputOTPDemo value={value} setValue={setValue} />
        <div className="flex items-end justify-end transition-all duration-300">
          <MyButton
            onClick={handleClick}
            className=" w-[201px] h-[68px] md:w-[301px] md:h-[88px] md:text-[36px]
      text-[24px] font-coustard font-black transition-all duration-300 rounded-lg"
          >
            {myString}
          </MyButton>
        </div>
      </Card>
    </div>
  );
}
