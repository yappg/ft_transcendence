/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import InputBar from '@/components/auth/input-bar';
import { MyButton } from '@/components/generalUi/Button';
import React, { useState } from 'react';
import { RiLock2Line } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { z } from 'zod';
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
    <div className="bg-linear-gradient flex h-screen w-full px-11 py-8">
      <div className="grid size-full grid-cols-3 gap-3 overflow-hidden">
        <div className="col-start-1 col-end-3 rounded-2xl bg-slate-100"></div>
        <div className="relative col-start-3 col-end-4 overflow-hidden rounded-2xl bg-slate-300">
          <div className="sticky top-0 flex h-[90px] w-full items-center justify-center gap-2 bg-pink-50 px-8">
            <InputBar
              Icon={field.Icon}
              placeholder={field.placeholder}
              value={field.value}
              type={field.type}
              setValue={field.setValue}
              error={'hello'}
              onBlur={() => {}}
            />
            {/* <MyButton className="rounded-full text-sm">search</MyButton> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default app;
