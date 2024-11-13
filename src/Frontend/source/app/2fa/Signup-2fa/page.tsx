'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { InputOTPDemo } from '@/components/2fa/InputOTPDemo';
import { MyButton } from '@/components/generalUi/Button';
import { useQRCode } from 'next-qrcode';
import axios from 'axios';

export default function LoginTFA() {
  const myString = 'Submit';
  const [value, setValue] = React.useState('');
  const [QRcode, setQRcode] = React.useState('e');
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    try {
      const fetchData = async () => {
        setIsLoading(true);
        const data = await axios.post('http://127.0.0.1:8000/2fa/generate-uri/', {
          username: 'mmesbahi',
        });
        console.log(data.data.uri);
        setQRcode(data.data.uri);
        setIsLoading(false);
      };
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);
  const { Canvas } = useQRCode();
  const handleClick = () => {
    if (value == '000000') alert('2FA activated successfully');
    else alert('Invalis OTP');
  };
  // if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="relative flex size-auto flex-col items-center justify-center gap-10 md:h-[90%] md:w-[85%]">
      <h1 className=" font-dayson flex items-center justify-center text-[40px] text-white transition-all duration-300 md:text-[70px]">
        activate 2FA
      </h1>
      {!isLoading && (
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
      {isLoading && <h1 className="font-dayson text-[30px] text-gray-600">Loading...</h1>}
      <InputOTPDemo value={value} setValue={setValue} />
      <div className="mt-20 flex flex-col items-center justify-center gap-[20px] md:mt-0 md:w-full md:gap-[40px]">
        <MyButton
          onClick={handleClick}
          className="font-coustard h-[68px] w-[201px] rounded-lg text-[24px] 
      font-black transition-all duration-300 md:h-[88px] md:w-[301px] md:text-[36px]"
        >
          {myString}
        </MyButton>
        <Link href="/Home" className="font-coustard text-[#284F50]">
          Skip this step
        </Link>
      </div>
    </div>
  );
}
