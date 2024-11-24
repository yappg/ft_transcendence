/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Card from '@/components/generalUi/Card';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLeft, setIsLeft] = useState(true);
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false); // Controls animation state

  useEffect(() => {
    // Trigger animation
    setIsAnimating(true);

    // Wait for animation to complete before updating position
    const timer = setTimeout(() => {
      setIsLeft(pathname === '/auth/signup');
      setIsAnimating(false);
    }, 10); // Match the animation duration (2s)

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [pathname]);
  return (
    <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full items-end justify-start overflow-auto">
      <div className="z-0 flex h-[95%] w-full min-w-[350px] flex-col items-start">
        <div className="z-10 mb-[-75px] flex h-[150px] w-full items-center justify-center md:mb-[-80px] lg:hidden">
          <Link href="/">
            <img
              src="/landing-page-logo.svg"
              alt="logo"
              className="size-[150px] md:size-[200px] dark:hidden"
            />
            <img
              src="/landing-page-dark-logo.svg"
              alt="logo"
              className="hidden size-[150px] md:size-[200px] dark:block"
            />
          </Link>
        </div>
        <div className="flex w-full grow items-start justify-center md:justify-center lg:items-start lg:py-[12vh]">
          {/* <div className="flex size-full justify-start md:size-[85%] md:h-auto md:max-h-[850px] md:min-h-[500px] md:max-w-[1100px]">
            {children}
            <Link href="/" className="z-[1] order-2 hidden w-[550px] lg:flex lg:items-center">
              <img src="/logo.svg" alt="logo-shadow.svg" />
            </Link>
          </div> */}
          <div
            className={`relative flex size-fit items-center transition-all duration-1000 ease-in-out ${
              !isLeft ? 'lg:mr-[120px]' : 'lg:ml-[120px]'
            }`}
          >
            <Card
              className={`px-9 pt-16 sm:px-16 md:size-[85%] md:h-auto md:max-h-[850px]  md:min-h-[500px] md:w-[600px] md:rounded-b-[30px] lg:w-[850px] lg:max-w-[850px]  ${isLeft ? 'lg:pl-[230px]' : 'lg:pr-[230px]'} lg:pt-4`}
            >
              {children}
            </Card>
            <div
              className={`absolute  transition-all duration-500 ease-in-out ${
                !isLeft ? 'ml-[570px]' : 'ml-[-200px]'
              } z-[1] hidden w-[460px] lg:flex lg:items-center`}
            >
              <img src="/logo.svg" alt="logo-shadow.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
