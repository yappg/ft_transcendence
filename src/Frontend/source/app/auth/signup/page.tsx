/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React, { useState } from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { getFields } from './fieldes';
import Card from '@/components/generalUi/Card';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');

  const fields = getFields(
    username,
    email,
    password,
    verifyPassword,
    setUsername,
    setEmail,
    setPassword,
    setVerifyPassword
  );

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
    <Card className="order-3 h-auto w-full px-9 pt-16 sm:px-16 md:h-auto md:w-full md:rounded-b-[30px] lg:ml-[-250px] lg:min-h-[550px] lg:w-5/6 lg:pl-[250px] lg:pt-4">
      <div className="flex h-fit flex-col gap-2">
        <Title />
        <Form fields={fields} buttonProps={buttonProps} isSignup={true} />
        <MyLink text="Already have an account? " href="login" />
      </div>
    </Card>
  );
}

export default Signup;
