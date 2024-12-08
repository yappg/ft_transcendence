'use client';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import React from 'react';
import { MyButton } from '@/components/generalUi/Button';
import { sendOtp } from '@/services/fetch-otp';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import withAuth from '@/context/requireAhuth';

const Login2fa = () => {
  const { user, updateUser } = useAuth();
  const [value, setValue] = React.useState('');
  const myString = 'Go >';
  const handleClick = async () => {
    try {
      const response = await sendOtp('verifiy-otp', value, user?.username || null) as any;

      console.log(response.data);
      if (response.data.message) {
        updateUser({ is2FAvalidated: true });
        toast({
          title: 'success',
          description: response.data.message,
          className: 'bg-primary border-none text-white bg-opacity-20',
        });
        return;
      } else if (response.data.error) {
        toast({
          title: 'error',
          description: response.data.error,
          className: 'bg-primary-dark border-none text-white bg-opacity-20',
        });
      }
    } catch {}
  };
  return (
    <div className="flex size-full flex-col items-center justify-center gap-10 transition-all">
      <div className="flex flex-col items-start justify-center transition-all">
        <h1 className="font-dayson text-3xl text-black opacity-80 transition-all duration-300 dark:text-white sm:text-5xl">
          2FA Code Required
        </h1>
      </div>
      <InputOTPDemo value={value} setValue={setValue} />
      <div className="flex items-end justify-end transition-all duration-300">
        <MyButton
          onClick={handleClick}
          className=" h-[68px] w-[201px] rounded-lg font-coustard text-[24px]
      font-black transition-all duration-300 md:h-[88px] md:w-[301px] md:text-[36px]"
        >
          {myString}
        </MyButton>
      </div>
    </div>
  );
};

export default withAuth(Login2fa, false);
