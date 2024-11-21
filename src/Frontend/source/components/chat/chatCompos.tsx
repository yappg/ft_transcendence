/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { FChatProps } from '@/constants/chat';
import { z } from 'zod';
import { FaSearch } from 'react-icons/fa';
import InputBar from '../auth/input-bar';
import { IoSend } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';

interface FChatProps {
  imageutl: string;
  name: string;
  text: string;
  time: string;
  unread: number;
}

export const FriendsChat = ({ imageutl, name, text, time, unread }: FChatProps) => {
  return (
    <div className="flex h-[100px] w-full items-center justify-between gap-2 border-b border-gray-400 px-2 text-white">
      <div className="flex h-full w-3/4 items-center justify-start gap-2 p-2">
        <div className="flex size-[60px] items-center justify-center rounded-full">
          <img src={imageutl} alt={`${name} PDP`} />
        </div>
        <div className="w-4/5">
          <h1>{name}</h1>
          <p className="line-clamp-1 w-full text-ellipsis text-[rgb(255,255,255,0.5)]">{text}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm text-[rgb(255,255,255,0.5)]">{time}</h3>
        <div
          className={`${unread > 0 ? 'dark:bg-primary-dark bg-green-300' : 'border border-[rgb(255,255,255,0.5)] bg-transparent text-[rgb(255,255,255,0.5)]'} flex size-[20px] items-center justify-center rounded-full text-xs`}
        >
          {unread > 0 ? unread : <RiCheckDoubleLine />}
        </div>
      </div>
    </div>
  );
};

const FormMaker = () => {
  const [value, setValue] = useState('');
  return {
    Icon: FaSearch,
    placeholder: 'make a search',
    value: '',
    type: 'text',
    setValue: () => {},
    validation: z.string().min(8, 'Password must be at least 8 characters'),
  };
};
export const ChatList = () => {
  const field = FormMaker();
  return (
    <div className="bg-black-crd costum-little-shadow relative col-start-1 col-end-4 overflow-hidden rounded-2xl lg:col-start-3">
      <div className="bg-black-crd sticky top-0 flex h-[120px] w-full items-center justify-center gap-4 px-4 dark:bg-black">
        <InputBar
          className="w-auto rounded-[10px] px-4 py-2"
          Icon={field.Icon}
          placeholder={field.placeholder}
          value={field.value}
          type={field.type}
          setValue={field.setValue}
          error={'hello'}
        />
        <div className="bg-white-crd flex size-fit items-center justify-center rounded-[10px] border border-[rgb(0,0,0,0.8)] p-[5px] dark:border-white">
          <FiPlus className="size-[30px] text-[rgb(0,0,0,0.8)] dark:text-white" />
        </div>
      </div>
      <div className="no-scrollbar h-full overflow-y-scroll">
        {FChatProps.map((data, index) => (
          <FriendsChat key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

const Message = () => {
  return (
    <div className="h-fit w-full text-gray-100">
      <div className="h-fit w-[400px] rounded-md bg-black-crd px-3 py-2">
        <h1>John Doe</h1>
        <p className=" h-fit w-full font-thin">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsumdolor
          sit amet consectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit
          ametconsectetur adipisicing elit. Quisquam, quod.Lorem ipsum dolor sit amet
        </p>
        <h3 className="text-sm text-[rgb(255,255,255,0.5)] text-end">10:30</h3>
      </div>
    </div>
  );
};

export const Messages = () => {
  return (
    <div className="costum-little-shadow bg-black-crd col-start-1 col-end-3 hidden items-center justify-center overflow-hidden rounded-2xl bg-[url('/chat-bg.png')] pb-4 lg:flex lg:flex-col">
      {/* headbar */}
      <div className="bg-[rgb(0,0,0,0.7)] h-[120px] w-full costum-little-shadow px-4 flex items-center justify-between text-white font-dayson">
        <div className='flex items-start gap-4'>
          <div className='size-[70px] rounded-full bg-slate-400 flex items-center justify-center'>
            <img src="/logo.svg" alt="" />
          </div>
          <div>
            <h2>John Doe</h2>
            <h3 className='text-primary dark:text-primary-dark font-poppins'>online</h3>
          </div>
        </div>
        . . .
      </div>
      {/* messages */}
      <div className="no-scrollbar flex h-full w-[90%] flex-col gap-2 overflow-scroll py-2">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      {/* message input  */}
      <div className="bg-black-crd flex h-[60px]  w-11/12 items-center gap-4 rounded-md px-4 ">
        <div className="flex size-full items-center  gap-3 px-4">
          <FiPlus className="dark: size-[30px] text-white" />
          <input
            placeholder="Start a new conversation"
            className="size-full bg-transparent text-white focus:outline-none"
          />
        </div>
        <div className="bg-primary dark:bg-primary-dark flex size-[40px] items-center justify-center rounded-md">
          <IoSend className="size-[20px] text-white" />
        </div>
      </div>
    </div>
  );
};
