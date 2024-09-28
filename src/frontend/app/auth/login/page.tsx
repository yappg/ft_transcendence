import React from 'react';
import Title from '@/components/auth/title';
import { FaRegUser } from 'react-icons/fa';
import { RiLock2Line } from 'react-icons/ri';
import { Form, MyLink } from '@/components/auth/form';

function Login() {
  const fields = [
    { Icon: FaRegUser, placeholder: 'username' },
    { Icon: RiLock2Line, placeholder: 'password' },
  ];
  return (
    <div className="costum-shadow flex w-full grow flex-col justify-between rounded-t-[50px] bg-gradient-radial px-9 pt-16 sm:px-16 md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:min-h-[550px] lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} buttonlabel="login" />
      <MyLink text="Have no account yet? " href="signup" />
    </div>
  );
}

export default Login;
