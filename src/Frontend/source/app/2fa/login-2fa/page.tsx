'use client';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import React from 'react';
import { MyButton } from '@/components/generalUi/Button';
import { sendOtp } from '@/hooks/fetch-otp';
import { useAuth } from '@/context/AuthContext';
import withAuth from '@/context/requireAhuth';

const Login2fa = () => {
  const { user } = useAuth();
  const [value, setValue] = React.useState('');
  const myString = 'Go >';
  const handleClick = () => {
    console.log('hada user: ', user);
    sendOtp('verifiy-otp', value, user?.username || null);
  };
  return (
    <div className="flex size-full flex-col items-center justify-center gap-10 transition-all">
      <div className="flex flex-col items-start justify-center transition-all">
        <h1 className="font-dayson text-3xl text-black opacity-80 transition-all duration-300 sm:text-5xl dark:text-white">
          2FA Code Required
        </h1>
      </div>
      <InputOTPDemo value={value} setValue={setValue} />
      <div className="flex items-end justify-end transition-all duration-300">
        <MyButton
          onClick={handleClick}
          className=" font-coustard h-[68px] w-[201px] rounded-lg text-[24px]
      font-black transition-all duration-300 md:h-[88px] md:w-[301px] md:text-[36px]"
        >
          {myString}
        </MyButton>
      </div>
    </div>
  );
};

export default withAuth(Login2fa, true);
