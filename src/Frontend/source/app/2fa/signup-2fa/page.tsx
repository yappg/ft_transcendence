'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import { MyButton } from '@/components/generalUi/Button';
import { useQRCode } from 'next-qrcode';
import { fetchQrCode, sendOtp } from '@/services/fetch-otp';
import { toast } from '@/hooks/use-toast';

const Signup2fa = () => {
  const myString = 'Submit';
  const [value, setValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);
  const [QRcode, setQRcode] = React.useState('e');
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    fetchQrCode(setIsLoading, setQRcode, 'user?.username || null'); // also this
  }, []);

  const { Canvas } = useQRCode();
  const handleClick = () => {
    if (value.length !== 6) {
      setIsValid(false);
      return;
    } else {
      const valid = async () => {
        const response = await sendOtp('verifiy-otp', value, 'user?.username || null'); // need to edit this after talking to kadigh
        console.log(response);
        if (response.data.message) {
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
      };
      valid();
    }
  };
  return (
    <div className="relative flex size-auto flex-col items-center justify-center gap-4 md:h-[90%] md:w-[85%]">
      <h1 className=" font-dayson flex items-center justify-center text-[40px] text-white transition-all duration-300">
        activate 2FA
      </h1>
      {isLoading ? (
        <h1 className="border-white-crd font-dayson flex size-[200px] items-center justify-center rounded-md border text-[30px] text-gray-600">
          Loading...
        </h1>
      ) : (
        <Canvas
          text={QRcode}
          options={{
            errorCorrectionLevel: 'M',
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: '#000',
              light: '#fff',
            },
          }}
        />
      )}
      <InputOTPDemo value={value} setValue={setValue} />
      <div className="flex flex-col items-center justify-center gap-[20px] md:w-full md:gap-[40px]">
        <MyButton onClick={handleClick} className="min-w-[120px] disabled:opacity-50">
          {myString}
        </MyButton>
        <Link href="/home" className="font-poppins text-[10px] text-[#284F50]">
          Skip this step
        </Link>
      </div>
    </div>
  );
};

export default Signup2fa;
