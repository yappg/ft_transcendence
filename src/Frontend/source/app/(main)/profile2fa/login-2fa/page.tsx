/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { InputOTPDemo } from "@/components/2fa/InputOTPDemo";
import React, { Suspense } from "react";
import { MyButton } from "@/components/generalUi/Button";
import { sendOtp } from "@/services/fetch-otp";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/GlobalContext";

const LoadingComponent = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>Loading game arena...</div>
    </div>
  );
};

const Login2faContent = () => {
  const [value, setValue] = React.useState<string | null>(null);
  const [storedusename, setStoredusename] = React.useState<string | null>(null);


  React.useEffect(() => {
    if (value) setStoredusename(value);
  }, [value]);

  const myString = "Go >";
  const { user } = useUser();
  const handleClick = async () => {
    try {
      const response = (await sendOtp(
        "verifiy-otp",
        value ?? "",
        storedusename,
      )) as any;

      if (response.data.message) {
        toast({
          title: "success",
          description: response.data.message,
          className: "bg-primary border-none text-white bg-opacity-20",
        });
        return;
      } else if (response.data.error) {
        toast({
          title: "error",
          description: response.data.error,
          className: "bg-primary-dark border-none text-white bg-opacity-20",
        });
      }
    } catch (error) {
      toast({
        title: "error",
        description: "Oops something went wrong! Try fetching later",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex size-full flex-col items-center justify-center gap-10 transition-all">
      <div className="flex flex-col items-start justify-center transition-all">
        <h1 className="font-dayson text-3xl text-black opacity-80 transition-all duration-300 dark:text-white sm:text-5xl">
          2FA Code Required
        </h1>
      </div>
      <InputOTPDemo value={value ?? ""} setValue={setValue} />
      <div className="flex items-end justify-end transition-all duration-300">
        <MyButton
          onClick={handleClick}
          className="h-[68px] w-[201px] rounded-lg font-poppins text-[24px] font-black transition-all duration-300 md:h-[88px] md:w-[301px] md:text-[36px]"
        >
          {myString}
        </MyButton>
      </div>
    </div>
  );
};
const Login2fa = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Login2faContent />
    </Suspense>
  );
};

export default Login2fa;
