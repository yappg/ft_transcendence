import React from 'react';
import Title from '@/components/auth/title';
import { FaRegUser } from 'react-icons/fa6';

function signup() {
  return (
    <div className="z-0 order-3 flex size-full flex-col gap-5 rounded-t-[50px] bg-gradient-radial px-[50px] pt-[70px] md:rounded-b-[50px] lg:ml-[-250px] lg:h-auto lg:w-5/6 lg:pl-[250px]">
      <Title />
      <div className="flex h-auto justify-center">
        <label className="flex h-[28px] w-[90%] items-center gap-5 bg-black p-[24px]">
          <FaRegUser className="size-[30px]" />
          <input type="text" className="grow bg-transparent" placeholder="username" />
        </label>
      </div>
      <div className="h-full bg-blue-400"></div>
    </div>
  );
}

export default signup;
