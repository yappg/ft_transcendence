import React from 'react';
import InputBar from './input-bar';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineLock } from 'react-icons/md';

const Form = () => {
  return (
    <form className="flex w-full min-w-[370px] max-w-[500px] flex-col items-center gap-5 py-12 px-6">
      <InputBar Icon={FaRegUser} placeholder="username" />
      <InputBar Icon={MdOutlineLock} placeholder="password" />
    </form>
  );
};

export default Form;
