import React from 'react';
import Title from '@/components/auth/title';
import Form from '@/components/auth/form';

function Login() {
  return (
    <div className="flex size-full flex-col items-start rounded-t-[50px] bg-gradient-radial pl-9 pt-16 sm:pl-16 md:rounded-b-[50px] lg:mr-[-250px] lg:h-auto lg:w-5/6 lg:pr-[250px] lg:pt-4">
      <Title />
      <Form />
    </div>
  );
}

export default Login;
