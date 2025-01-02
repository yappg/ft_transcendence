'use client'

import axios from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction } from 'react';


export const sendOtp = async (endpoint: string, value: string, name: string | null) => {
  try {
    const response = await axios.post(`/accounts/2fa/${endpoint}/`, {
      username: name,
      otp_token: value,
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Authentication error: ${error.message}`);
    }

    throw new Error('Authentication failed');
  }
}

export const fetchQrCode = async (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setQRcode: Dispatch<SetStateAction<string>>, user: string | null
) => {
  try {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await axios.post('/accounts/2fa/generate-uri/', {
        username: user,
      });
      setQRcode(data.data.uri);
      setIsLoading(false);
    };
    fetchData();
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Oups somthing went wrong! try fetching later'
    })
  }
};
