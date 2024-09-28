'use client';
import React from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { FaRegUser } from 'react-icons/fa';
import { RiLock2Line } from 'react-icons/ri';
import { MdOutlineMail } from 'react-icons/md';
import { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const buttonAction = () => {
    console.log('clicked');
    let result = '';
    fields.map((field) => (result += field.value + ' '));
    alert(result);
  };
  const fields = [
    { Icon: MdOutlineMail, placeholder: 'email', value: email, setValue: setEmail },
    { Icon: FaRegUser, placeholder: 'username', value: username, setValue: setUsername },
    { Icon: RiLock2Line, placeholder: 'password', value: password, setValue: setPassword },
    {
      Icon: RiLock2Line,
      placeholder: 'verify password',
      value: verifyPassword,
      setValue: setVerifyPassword,
    },
  ];
  const buttonProps = { text: 'signup', onClick: buttonAction };
  return (
    <div className="costum-shadow order-3 flex w-full grow flex-col justify-between gap-3 rounded-t-[50px] bg-gradient-radial px-9 pt-16 sm:px-16 md:rounded-b-[50px] lg:ml-[-250px] lg:min-h-0 lg:w-5/6 lg:pl-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} buttonprops={buttonProps} />
      <MyLink text="already have an account ?  " href="login" />
    </div>
  );
}

export default Signup;
