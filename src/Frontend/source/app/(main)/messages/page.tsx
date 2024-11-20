/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import InputBar from '@/components/auth/input-bar';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { z } from 'zod';
import FriendsChat from '@/components/chat/friendsChat';
import { FChatProps } from '@/constants/chat';
import { IoSend } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';

type FieldType = 'input' | 'password' | 'email' | 'text' | 'number' | 'date';

interface FormField {
  Icon: React.ElementType;
  placeholder: string;
  value: string;
  type: FieldType;
  setValue: (value: string) => void;
  validation?: z.ZodType<any>;
}
const FormMaker = () => {
  const [value, setValue] = useState('');
  return {
    Icon: FaSearch,
    placeholder: 'make a search',
    value: '',
    type: 'password' as const,
    setValue: () => {},
    validation: z.string().min(8, 'Password must be at least 8 characters'),
  };
};

const app = () => {
  const field = FormMaker();
  return (
    <div className="bg-linear-gradient dark:bg-linear-gradient-dark flex h-screen w-full px-11 py-8">
      <div className="grid size-full grid-cols-3 gap-6 overflow-hidden p-3">
        <div className="col-start-1 col-end-3 hidden items-end justify-center rounded-2xl bg-slate-100 p-4 lg:flex">
          <div className="bg-secondary flex h-[60px]  w-11/12 items-center gap-4 rounded-md px-4">
            <div className="flex size-full items-center  gap-3 px-4">
              <FiPlus className="dark: size-[30px] text-gray-400" />
              <input
                placeholder="Start a new conversation"
                className="text-primary bg-transparent focus:outline-none"
              />
            </div>
            <div className="bg-primary dark:bg-primary-dark flex size-[40px] items-center justify-center rounded-md">
              <IoSend className="size-[20px] text-white" />
            </div>
          </div>
        </div>
        <div className="bg-black-crd costum-little-shadow relative col-start-1 col-end-4 overflow-hidden rounded-2xl lg:col-start-3">
          <div className="bg-black-crd sticky top-0 flex h-[120px] w-full items-center justify-center gap-4 px-8 dark:bg-black">
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
      </div>
    </div>
  );
};

export default app;
