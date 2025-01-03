/* eslint-disable tailwindcss/no-custom-classname */
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

interface ButtonProps {
  children: string;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  disabled?: boolean;
  route?: string;
}

const MyButton = ({ children, className, onClick, disabled, type, route }: ButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else if (route) router.push(`${route}`);
  };
  return (
    <button
      className={`${className} ${buttonVariants()} costum-little-shadow w-[120px] bg-primary font-dayson text-[18px] font-semibold text-white dark:bg-primary-dark`}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export { MyButton };
