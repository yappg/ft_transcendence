import React from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineLock } from 'react-icons/md';

function signup() {
  const fields = [
    { Icon: FaRegUser, placeholder: 'hdfjbsbzdj' },
    { Icon: FaRegUser, placeholder: 'hdfjbsbzdj' },
    { Icon: FaRegUser, placeholder: 'username' },
    { Icon: MdOutlineLock, placeholder: 'password' },
  ];
  return (
    <div className="z-0 order-3 flex size-full flex-col justify-between gap-5 rounded-t-[50px] bg-gradient-radial px-[50px] pt-16 md:rounded-b-[50px] lg:ml-[-250px] lg:h-auto lg:w-5/6 lg:pl-[250px] lg:pt-4">
      <Title />
      <Form fields={fields} />
      <MyLink text="already have an account ?  " href="login" />
    </div>
  );
}

export default signup;
