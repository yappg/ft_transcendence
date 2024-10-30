'use client';
import { Card } from '@/components/2fa/Card';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import React from 'react';
import Button from '@/components/2fa/Button';
export default function SignupTFA() {
  const [value, setValue] = React.useState('');
  const myString = 'Go >';
  const handleClick = () => {
    if (value == '000000') alert('2FA activated successfully');
    else alert('Invalis OTP');
  };
  return (
    <div className="w-full h-screen bg-[#13191D] flex items-start p-0 xl:pt-[5%] justify-center overflow-auto">
      <Card style="min-h-[500px] flex items-center justify-center transition-all gap-4 overflow-auto">
        <div className="md:w-[85%] md:h-[90%] h-auto w-auto flex flex-col  items-center justify-center">
          <div className="flex flex-col items-start justify-center transition-all gap-4 2xl:gap-10 lg:min-h-3/6 xl:min-h-4/6 h-4/6 md:h-5/6 pt-10">
            <h1 className="text-lg text-white flex items-center justify-start text-start font-coustard opacity-80 h-1/2 md:w-[100%] w-[80%] min-w-[260px] sm:text-4xl md:text-5xl lg:text-5xl transition-all duration-300 ">
              Tow Factor Authentification
            </h1>
          </div>
          <InputOTPDemo value={value} setValue={setValue} />
          <div className="flex h-full items-end justify-end transition-all duration-300">
            <Button value={myString} onClick={handleClick} />
          </div>
        </div>
      </Card>
    </div>
  );
}
