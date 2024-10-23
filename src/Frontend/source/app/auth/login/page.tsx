'use client';
import React from 'react';
import Title from '@/components/auth/title';
import { FaRegUser } from 'react-icons/fa';
import { RiLock2Line } from 'react-icons/ri';
import { Form, MyLink } from '@/components/auth/form';
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const buttonAction = () => {
    console.log('clicked');
    let result = '';
    fields.map((field) => (result += field.value + ' '));
    alert(result);
  };
  const fields = [
    {
      Icon: FaRegUser,
      placeholder: 'username',
      value: username,
      type: 'input',
      setValue: setUsername,
    },
    {
      Icon: RiLock2Line,
      placeholder: 'password',
      value: password,
      type: 'password',
      setValue: setPassword,
    },
  ];
  const buttonProps = { text: 'signup', onClick: buttonAction };
  return (
    <div className="costum-shadow flex w-full grow flex-col justify-between rounded-t-[50px] bg-custom2 px-9 pt-16 dark:bg-gradient-radial sm:px-16 md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:min-h-[550px] lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} buttonprops={buttonProps} />
      <MyLink text="Have no account yet? " href="signup" />
    </div>
  );
}

export default Login;
