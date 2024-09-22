import React from 'react';
import Title from '@/components/auth/title';
import { Form, MyLink } from '@/components/auth/form';

function Login() {
  return (
    <div className="costum-shadow flex size-full min-h-[500px] flex-col justify-between rounded-t-[50px] bg-gradient-radial px-9 pt-16 sm:pl-16 md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <Title />
      <Form />
      <MyLink text="Don't have an account? " href="Sign up" />
    </div>
  );
}

export default Login;
