import React from 'react';
import InputBar from './input-bar';
import { FaRegUser } from 'react-icons/fa';
import { MdOutlineLock } from 'react-icons/md';
import { Button } from '@/components/ui/button';

interface MyLinkProps {
  text: string;
  href: string;
}

const MyLink = ({ text, href }: MyLinkProps) => {
  return (
    <div className="flex h-16 w-full items-center justify-center">
      <p className="text-[rgb(255,255,255,0.6)]">
        {text}
        <a href={'/auth/' + href} className="text-red-500">
          {href}
        </a>
      </p>
    </div>
  );
};

interface FormProps {
  fields: { Icon: React.ElementType; placeholder: string }[];
  buttonlabel: string;
}

const Form = ({ fields, buttonlabel }: FormProps) => {
  return (
    <div className="flex w-full items-center justify-center px-6 py-8 sm:px-12 md:px-20 md:py-16 lg:px-5 lg:py-2">
      <form className="flex size-full flex-col items-start gap-8">
        <div className="flex w-full flex-col gap-5">
          {fields.map((field, index) => (
            <InputBar key={index} Icon={field.Icon} placeholder={field.placeholder} />
          ))}
        </div>
        <div className="flex w-full justify-center lg:justify-start lg:pl-8">
          <Button variant={'default'} size={'lg'}>
            {buttonlabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Form, MyLink };
