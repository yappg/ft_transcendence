/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { InputOTPDemo } from "@/components/2fa/InputOTPDemo";
import { MyButton } from "@/components/generalUi/Button";
import { QRCodeSVG } from "qrcode.react";
import { sendOtp } from "@/services/fetch-otp";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/GlobalContext";
import { Skeleton } from "@/components/ui/skeleton";

const Signup2fa = () => {
  const [value, setValue] = useState("");
  const [QRcode, setQRcode] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();
  const [enable2fa, setEnable2fa] = useState(false);

  const { user, isLoading } = useUser();

  const myString = "Submit";

  const fetchQrCode = async (userName: string) => {
    try {
      setLocalLoading(true);
      const { data } = await axios.post("/accounts/2fa/generate-uri/", {
        username: userName,
      });
      if (data.error) {
        setEnable2fa(false);
        toast({
          title: "Error",
          description: data.error,
          className: "bg-primary-dark border-none text-white bg-opacity-20",
        });
        return;
      }
      if (data?.uri) {
        setQRcode(data.uri);
        setEnable2fa(true);
      } else {
        throw new Error("No URI received");
      }
    } catch (error) {
      console.error("QR Code fetch error:", error);
      toast({
        title: "Error",
        description: "Oops something went wrong! Try fetching later",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchQrCode(user.username);
    }
  }, [user?.username]);

  const handleClick = async () => {
    if (value.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a 6-digit code",
        variant: "destructive",
        duration: 8000,
      });
      return;
    }

    try {
      const response = await sendOtp(
        "verifiy-otp",
        value,
        user?.username || null,
      );

      if (response.data.message) {
        toast({
          title: "Success",
          description: response.data.message,
          className: "bg-primary-dark border-none text-white bg-opacity-20",
          duration: 8000,
        });
        router.push("/home");
      } else if (response.data.error) {
        toast({
          title: "Error",
          description: response.data.error,
          className:
            "bg-primary-dark border-none text-white bg-opacity-20 border-2",
          duration: 8000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP",
        variant: "destructive",
        duration: 8000,
      });
    }
  };

  return (
    <div className="relative flex size-auto flex-col items-center justify-center gap-4 md:h-[90%] md:w-[85%]">
      <h1 className="flex items-center justify-center font-dayson text-[40px] text-white transition-all duration-300">
        activate 2FA
      </h1>

      {isLoading || localLoading ? (
        <Skeleton className="size-[200px]" />
      ) : QRcode ? (
        <div className="flex size-[200px] items-center justify-center rounded-md border border-white-crd bg-white">
          <QRCodeSVG value={QRcode} size={180} level="M" includeMargin={true} />
        </div>
      ) : (
        <div className="flex size-[200px] items-center justify-center rounded-md border border-white-crd font-dayson text-gray-600">
          No QR Code Available
        </div>
      )}

      <InputOTPDemo value={value} setValue={setValue} />

      <div className="flex flex-col items-center justify-center gap-[20px] md:w-full md:gap-[40px]">
        <MyButton
          onClick={handleClick}
          className="min-w-[120px] disabled:opacity-50"
          disabled={!QRcode || value.length !== 6}
        >
          {myString}
        </MyButton>
        <Link href="/home" className="font-poppins text-[15px] text-[#284F50]">
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default Signup2fa;
