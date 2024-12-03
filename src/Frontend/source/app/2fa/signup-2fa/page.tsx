'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import { MyButton } from '@/components/generalUi/Button';
import { useQRCode } from 'next-qrcode';
import { fetchQrCode, sendOtp } from '@/hooks/fetch-otp';
import withAuth from '@/context/requireAhuth';
import { useAuth } from '@/context/AuthContext';

const Signup2fa = () => {
  const myString = 'Submit';
  const { user } = useAuth();
  const [value, setValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [QRcode, setQRcode] = React.useState('e');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    fetchQrCode(setIsLoading, setQRcode, user);
  }, []);

  const { Canvas } = useQRCode();
  const handleClick = () => {
    if (value.length !== 6) {
      setIsValid(false);
      return;
    } else {
      sendOtp('verifiy-otp/', value);
    }
  };
  return (
    <div className="relative flex size-auto flex-col items-center justify-center gap-10 md:h-[90%] md:w-[85%]">
      <h1 className=" font-dayson flex items-center justify-center text-[40px] text-white transition-all duration-300 md:text-[70px]">
        activate 2FA
      </h1>
      {isLoading ? (
        <h1 className="size-[250px] flex justify-center items-center font-dayson border border-white-crd rounded-md text-[30px] text-gray-600">
          Loading...
        </h1>
      ) : (
        <Canvas
          text={QRcode}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 250,
            color: {
              dark: '#000',
              light: '#fff',
            },
          }}
        />
      )}
      <InputOTPDemo value={value} setValue={setValue} />
      <div className="mt-20 flex flex-col items-center justify-center gap-[20px] md:mt-0 md:w-full md:gap-[40px]">
        <MyButton
          onClick={handleClick}
          className="font-dayson h-[68px] w-[201px] rounded-lg text-[24px] font-black
       transition-all duration-300 md:h-[88px] md:w-[301px] md:text-[36px]"
        >
          {myString}
        </MyButton>
        <Link href="/home" className="font-poppins text-[#284F50]">
          Skip this step
        </Link>
      </div>
    </div>
  );
};

export default withAuth(Signup2fa, true, true);
