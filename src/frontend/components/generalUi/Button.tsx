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
      className={`${buttonVariants()} font-dayson bg-primary dark:bg-primary-dark costum-little-shadow w-[120px] text-[18px] font-semibold text-white dark:text-white ${className}`}
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
