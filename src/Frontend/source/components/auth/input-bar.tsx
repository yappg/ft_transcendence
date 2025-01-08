import React from "react";

interface InputBarProps {
  Icon?: React.ElementType;
  placeholder: string;
  value: string;
  type?: string;
  setValue: (value: string) => void;
  error?: string;
  onBlur?: () => void;
  className?: string;
}

function InputBar({
  Icon,
  placeholder,
  value,
  type,
  setValue,
  error,
  className,
}: InputBarProps) {
  return (
    <div
      className={`${className} flex w-full items-center gap-5 rounded-full border border-[rgb(0,0,0,0.8)] px-6 py-3 focus-within:border-none focus-within:bg-[rgb(0,0,0,0.4)] dark:border dark:border-[rgb(255,255,255,0.6)] dark:bg-[rgb(0,0,0,0.2)] dark:focus-within:bg-[rgb(0,0,0,0.6)]`}
    >
      {Icon && (
        <Icon className="size-[30px] text-[rgb(0,0,0,0.8)] opacity-60 dark:text-white" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent font-poppins text-lg text-black opacity-60 placeholder:text-black focus:outline-none dark:text-white dark:placeholder:text-white"
      />
    </div>
  );
}

export default InputBar;
