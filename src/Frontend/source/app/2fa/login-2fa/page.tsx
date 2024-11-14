'use client';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MyButton } from '@/components/generalUi/Button';
import axios from 'axios';
export default function SignupTFA() {
  const [value, setValue] = React.useState('');
  const myString = 'Go >';
  const router = useRouter();
  const handleClick = () => {
    sendOtp();
  };
  const sendOtp = async () => {
    try {
      const result = await axios.post('http://127.0.0.1:8000/2fa/validate-otp/', {
        username: 'mmesbahi',
        otp_token: value,
      });
      console.log(result);
      if (result.data.status) {
        alert('OTP verified');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error(error);
    }
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
}
