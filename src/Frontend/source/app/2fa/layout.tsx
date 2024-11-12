import Card from '@/components/generalUi/Card';
import React from 'react';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full items-start justify-center overflow-auto bg-[#13191D]">
      <Card className=" inline-block gap-8 p-4 shadow-2xl transition-all xl:mt-[10%] xl:rounded-[50px] 2xl:w-3/5 2xl:max-w-[1100px]">
        {children}
      </Card>
    </div>
  );
}
