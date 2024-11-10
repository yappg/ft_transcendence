/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { useState } from 'react';
import { getFields } from './fields';
import Card from '@/components/generalUi/Card';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const buttonAction = () => {
    console.log('clicked');
    let result = '';
    fields.map((field) => (result += field.value + ''));
    alert(result);
  };
  const fields = getFields(username, password, setUsername, setPassword);
  const buttonProps = { text: 'Login', onClick: buttonAction };
  return (
    //   md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:min-h-[550px] lg:w-5/6 lg:pr-[250px] lg:pt-4"
    // >
    <Card className="bg-white order-2 w-full px-9 pt-16 sm:px-16  rounded-b-[30px] md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:min-h-[550px] lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <div className="flex h-fit flex-col gap-4">
        <Title />
        <Form fields={fields} buttonProps={buttonProps} redirPath="/2fa/login-2fa" isSignup={false} />
        <MyLink text="Have no account yet? " href="signup" />
      </div>
    </Card>
    // </div>
  );
}

export default Login;
