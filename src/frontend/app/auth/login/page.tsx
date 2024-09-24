import React from 'react';
import Title from '@/components/auth/title';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineLock } from 'react-icons/md';
import { Form, MyLink } from '@/components/auth/form';

function Login() {
  const fields = [
    { Icon: FaRegUser, placeholder: 'username' },
    { Icon: MdOutlineLock, placeholder: 'password' },
  ];
  return (
    <div className="costum-shadow flex size-full min-h-[600px] flex-col justify-between rounded-t-[50px] bg-gradient-radial px-9 pt-16 sm:px-16 md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:min-h-[550px] lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} />
      <MyLink text="Have no account yet? " href="Sign up" />
    </div>
  );
}

export default Login;
