'use client'

import axios from 'axios';
import { toast } from './use-toast';
import { Dispatch, SetStateAction } from 'react';

export const sendOtp = async (endpoint: string, value: string) => {
  const name = localStorage.getItem('username');
  console.log(name);
  const BASE_URL = 'http://localhost:8080/api/2fa/';
  try {
    const result = await axios.post(`${BASE_URL}${endpoint}`, {
      username: name,
      otp_token: value,
    });
    console.log(result);
    if (result.data.status) {
      toast({
        title: 'success',
        description: result.data.message,
        className: 'bg-primary border-none text-white bg-opacity-20',
      });
    } else if (result.data.error) {
      toast({
        title: 'error',
        description: result.data.error,
        className: 'bg-primary-dark border-none text-white bg-opacity-20',
      });
    }
  } catch (error) {
    toast({
      title: 'error',
      description: 'Oups somthing went wrong !! please try again',
      className: 'bg-primary-dark border-none text-white bg-opacity-20',
    });
  }
};

export const fetchQrCode = async (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setQRcode: Dispatch<SetStateAction<string>>, user: string | null
) => {
  try {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await axios.post('http://localhost:8080/api/2fa/generate-uri/', {
        username: user,
      });
      setQRcode(data.data.uri);
      setIsLoading(false);
    };
    fetchData();
  } catch (error) {
    console.error('Error:', error);
  }
};
