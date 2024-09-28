import React from 'react';

interface InputBarProps {
  Icon: React.ElementType;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

function InputBar({ Icon, placeholder, value, setValue }: InputBarProps) {
  return (
    <div className="flex w-full items-center gap-5 rounded-full border border-[rgb(255,255,255,0.6)] bg-[rgb(0,0,0,0.2)] px-6 py-3 focus-within:border-none focus-within:bg-[rgb(0,0,0,0.6)]">
      <Icon className="size-[30px] min-w-[30px] opacity-60" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full appearance-none bg-transparent text-lg text-white opacity-60 focus:outline-none"
      />
    </div>
  );
}

export default InputBar;
