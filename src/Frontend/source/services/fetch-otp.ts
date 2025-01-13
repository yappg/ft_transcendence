"use client";
import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";
import { Dispatch, SetStateAction } from "react";
import { useUser } from "@/context/GlobalContext";

export const fetchQrCode = async (
  userName: string,
  setQRcode: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setEnable2fa: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const { data } = await axios.post("/accounts/2fa/generate-uri/", {
      username: userName,
    });
    if (data.error) {
      setEnable2fa(false);
      toast({
        title: "Error",
        description: data.error,
        className: "bg-primary-dark border-none text-white bg-opacity-20",
        duration: 8000,
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
      duration: 8000,
    });
  } finally {
    setIsLoading(false);
  }
};

export const sendOtp = async (
  endpoint: string,
  value: string,
  name: string | null,
) => {
  try {
    console.log("name", name, "value", value);
    const response = await axios.post(`/accounts/2fa/${endpoint}/`, {
      username: name,
      otp_token: value,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
    throw new Error("Authentication failed");
  }
};
