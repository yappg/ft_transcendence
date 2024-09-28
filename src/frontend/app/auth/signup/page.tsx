import React from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { FaRegUser } from 'react-icons/fa';
import { RiLock2Line } from 'react-icons/ri';
import { MdOutlineMail } from 'react-icons/md';

function signup() {
  const fields = [
    { Icon: MdOutlineMail, placeholder: 'email' },
    { Icon: FaRegUser, placeholder: 'username' },
    { Icon: RiLock2Line, placeholder: 'password' },
    { Icon: RiLock2Line, placeholder: 'verify password' },
  ];
  return (
    <div className="costum-shadow order-3 flex w-full grow flex-col justify-between gap-3 rounded-t-[50px] bg-gradient-radial px-9 pt-16 sm:px-16 md:rounded-b-[50px] lg:ml-[-250px] lg:min-h-0 lg:w-5/6 lg:pl-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} buttonlabel="register" />
      <MyLink text="already have an account ?  " href="login" />
    </div>
  );
}

export default signup;
