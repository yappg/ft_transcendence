/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React, { useState } from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { FaRegUser } from 'react-icons/fa';
import { RiLock2Line } from 'react-icons/ri';
import { MdOutlineMail } from 'react-icons/md';
import { z } from 'zod';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const fields = [
    {
      Icon: MdOutlineMail,
      placeholder: 'email',
      value: email,
      type: 'email' as const,
      setValue: setEmail,
      validation: z.string().email('Invalid email format'),
    },
    {
      Icon: FaRegUser,
      placeholder: 'username',
      value: username,
      type: 'text' as const,
      setValue: setUsername,
      validation: z.string().min(3, 'Username must be at least 3 characters'),
    },
    {
      Icon: RiLock2Line,
      placeholder: 'password',
      value: password,
      type: 'password' as const,
      setValue: setPassword,
      validation: z.string().min(8, 'Password must be at least 8 characters'),
    },
    {
      Icon: RiLock2Line,
      placeholder: 'password2',
      value: verifyPassword,
      type: 'password' as const,
      setValue: setVerifyPassword,
      validation: z.string().min(8, 'Password must be at least 8 characters'),
    },
  ];

  const buttonProps = {
    text: 'Signup',
    onClick: () => {
      console.log('clicked');
      let result = '';
      fields.map((field) => (result += field.value + ' '));
      alert(result);
    },
  };

  return (
    <div className="costum-big-shadow bg-white-crd dark:bg-secondary order-3 flex w-full grow flex-col justify-center gap-3 rounded-t-[50px] px-9 pt-16 sm:px-16 md:h-fit md:rounded-b-[50px] lg:ml-[-250px] lg:min-h-0 lg:w-5/6 lg:pl-[250px] lg:pt-4">
      <div className="flex h-fit flex-col gap-2">
        <Title />
        <Form fields={fields} buttonProps={buttonProps} isSignup={true} />
        <MyLink text="Already have an account? " href="login" />
      </div>
    </div>
  );
}

export default Signup;
