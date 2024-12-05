import Card from '@/components/generalUi/Card';
import { ToastProvider } from '@radix-ui/react-toast';
import React from 'react';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full items-center md:justify-center justify-start overflow-auto bg-[#13191D]">
      <Card className="flex flex-col items-center justify-start size-full rounded-t-none lg:h-auto lg:w-[700px] overflow-scroll md:overflow-hidden">{children}</Card>
    </div>
  );
}
