/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <div className="flex w-full grow items-start justify-start md:justify-center lg:items-start lg:py-[12vh]">
          <div className="flex size-full justify-start md:size-[85%] md:h-auto md:max-h-[850px] md:min-h-[500px] md:max-w-[1100px]">
            {children}
            <Link href="/" className="z-[1] order-2 hidden w-[550px] lg:flex lg:items-center">
              <img src="/logo.svg" alt="logo-shadow.svg" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
