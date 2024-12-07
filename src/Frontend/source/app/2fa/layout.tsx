import Card from '@/components/generalUi/Card';
import withAuth from '@/context/requireAhuth';
import React, { ComponentType } from 'react';

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full items-center justify-start overflow-auto bg-[#13191D] bg-linear-gradient dark:bg-linear-gradient-dark md:justify-center">
      <Card className="flex size-full flex-col items-center justify-start overflow-scroll rounded-t-none md:overflow-hidden lg:h-auto lg:w-[700px]">
        {children}
      </Card>
    </div>
  );
}

export default withAuth(RootLayout as ComponentType<{}>, true);

// /2fa/signup-2fa