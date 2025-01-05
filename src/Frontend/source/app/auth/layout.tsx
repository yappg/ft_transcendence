/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */

'use client';

import Link from 'next/link';
import { useState, useEffect, ComponentType } from 'react';
import { usePathname } from 'next/navigation';
import Card from '@/components/generalUi/Card';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLeft, setIsLeft] = useState(true);
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsLeft(pathname === '/auth/signup');
      setIsAnimating(false);
    }, 10);

    return () => clearTimeout(timer);
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
          <div
            className={`relative flex size-full items-center transition-all duration-1000 ease-in-out md:size-fit ${
              !isLeft ? 'lg:mr-[120px]' : 'lg:ml-[120px]'
            }`}
          >
            <Card
              className={`size-full px-9 pt-16 sm:px-16 md:size-[85%] md:h-auto md:max-h-[850px]  md:min-h-[500px] md:w-[600px] md:rounded-b-[30px] lg:w-[850px] lg:max-w-[850px]  ${isLeft ? 'lg:pl-[230px]' : 'lg:pr-[230px]'} lg:pt-4`}
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
