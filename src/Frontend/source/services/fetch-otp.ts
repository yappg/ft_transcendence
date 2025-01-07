'use client';
import axios from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction } from 'react';
import { useUser } from '@/context/GlobalContext';

export const sendOtp = async (endpoint: string, value: string, name: string | null) => {
  try {
    console.log('name', name, 'value', value);
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
};

