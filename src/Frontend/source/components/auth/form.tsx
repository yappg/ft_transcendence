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
      <p className="text-[rgb(0,0,0,0.6)] dark:text-[rgb(255,255,255,0.6)]">
        {text}
        <a href={'/auth/' + href} className="font-bold text-[#284F50] dark:text-red-500">
          {href}
        </a>
      </p>
    </div>
  );
};

interface FormProps {
  fields: {
    Icon: React.ElementType;
    placeholder: string;
    value: string;
    type?: string;
    setValue: (value: string) => void;
  }[];
  buttonprops: {
    text: string;
    onClick: () => void;
  };
}

const Form = ({ fields, buttonprops }: FormProps) => {
  return (
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-12 md:px-20 md:py-16 lg:px-5 lg:py-2">
      <form className="flex size-full flex-col items-start gap-8">
        <div className="flex w-full flex-col gap-5">
          {fields.map((field, index) => (
            <InputBar
              key={index}
              Icon={field.Icon}
              placeholder={field.placeholder}
              value={field.value}
              type={field.type}
              setValue={field.setValue}
            />
          ))}
        </div>
        <div className="flex w-full justify-center lg:justify-start lg:pl-8">
          <Button ref={null} onClick={buttonprops.onClick}>
            {buttonprops.text}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { Form, MyLink };
