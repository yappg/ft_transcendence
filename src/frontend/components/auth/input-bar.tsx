import React from 'react';

interface InputBarProps {
  Icon: React.ElementType;
  placeholder: string;
  value: string;
  type?: string;
  setValue: (value: string) => void;
}

function InputBar({ Icon, placeholder, value, type, setValue }: InputBarProps) {
  return (
    <div className="flex w-full items-center gap-5 rounded-full border border-[rgb(0,0,0,0.6)] px-6 py-3 focus-within:border-none focus-within:bg-[rgb(0,0,0,0.4)] dark:border dark:border-[rgb(255,255,255,0.6)] dark:bg-[rgb(0,0,0,0.2)] dark:focus-within:bg-[rgb(0,0,0,0.6)]">
      <Icon className="size-[30px] min-w-[30px] opacity-60 dark:text-white" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent text-lg font-light opacity-60 text-black dark:text-white placeholder:text-black focus:outline-none dark:placeholder:text-white"
      />
    </div>
  );
}

export default InputBar;
