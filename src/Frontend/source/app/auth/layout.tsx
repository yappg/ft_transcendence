/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Inter, Coustard } from 'next/font/google';
import Link from 'next/link';
import { Providers } from '../providers';

const inter = Inter({
  subsets: ['latin'],
  // variable: '--font-Inter',
  weight: ['400', '700'],
});

const coustard = Coustard({
  subsets: ['latin'],
  weight: ['400', '900'],
  variable: '--font-coustard',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="flex h-screen w-full items-end justify-start overflow-auto bg-gradient-linear-white dark:bg-custom">
        <div className="z-0 flex h-[95%] w-full min-w-[350px] flex-col items-start">
          <div className="z-10 mb-[-75px] flex h-[150px] w-full items-center justify-center md:mb-[-80px] lg:hidden">
            <Link href="/">
              <img
                src="/landing-page-logo.svg"
                alt="logo"
                className="size-[150px] dark:hidden md:size-[200px]"
              />
              <img
                src="/landing-page-dark-logo.svg"
                alt="logo"
                className="hidden size-[150px] dark:block md:size-[200px]"
              />
            </Link>
          </div>
          <div className="flex w-full grow items-start justify-start md:justify-center lg:items-start lg:py-[12vh]">
            <div className="flex size-full justify-start md:size-[85%] md:h-auto md:max-h-[850px] md:min-h-[500px] md:max-w-[1100px]">
              {children}
              <a href="/" className="z-[1] order-2 hidden w-[550px] lg:flex lg:items-center">
                <img src="/logo.svg" alt="logo-shadow.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Providers>
  );
}