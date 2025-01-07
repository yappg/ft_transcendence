/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { OAuthClient } from '@/services/fetch-oauth';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';

function Title() {
  const code = useSearchParams().get("code");
  const provider = useSearchParams().get("provider");

  useEffect(() => {
    if (code) {
      if (provider && provider === 'google') {
        axios
          .get('/accounts/oauth/callback/google/', {
            params: {
              code: code,
            },
          })
          .then(() => (window.location.href = "/home"))
          .catch((error) => {
            console.log(error);
            window.location.href = "/auth/login";
          });
      } else {
        console.log('--------42', code);
        axios
          .get('/accounts/oauth/callback/42/', {
            params: {
              code: code,
            },
          })
          .then(() => (window.location.href = "/home"))
          .catch((error) => {
            console.log(error);
            window.location.href = "/auth/login";
          });
      }
    }
  }, []);
  const handleGoogle = () => {
    OAuthClient.google();
  };

  const handleIntra42 = () => {
    OAuthClient.intra42();
  };

  return (
    <div className="flex h-auto w-3/4 flex-col justify-center lg:w-5/6">
      <div className="mb-[-6px] flex size-full h-[35px] gap-4 pl-2 md:mb-[-10px] md:h-[40px]">
        <div onClick={handleGoogle}>
          <img src="/google.svg" alt="google" className="h-full dark:hidden" />
          <img
            src="/google-dark.svg"
            alt="google"
            className="hidden h-full dark:block"
          />
        </div>
        <div onClick={handleIntra42}>
          <img
            src="/42.svg"
            alt="google"
            className=" h-full py-[0.35rem] dark:hidden"
          />
          <img
            src="/42-dark.svg"
            alt="google"
            className=" hidden h-full py-[0.35rem] dark:block"
          />
        </div>
      </div>
      <div className="h-4/6 font-dayson text-[30px] dark:text-white">
        <h1 className="h-[45px] text-[2.7rem] md:h-[80px] md:text-[4.2rem]">
          Authenticate
        </h1>
        <h1 className="flex items-start justify-start gap-2">
          your
          <span className="text-primary dark:text-primary-dark">account</span>
        </h1>
      </div>
    </div>
  );
}

export default Title;
