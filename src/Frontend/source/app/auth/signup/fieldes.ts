import { Dispatch, SetStateAction } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { RiLock2Line } from "react-icons/ri";
import { z } from "zod";

export function getFields(
  username: string,
  email: string,
  password: string,
  verifyPassword: string,
  setUsername: Dispatch<SetStateAction<string>>,
  setEmail: Dispatch<SetStateAction<string>>,
  setPassword: Dispatch<SetStateAction<string>>,
  setVerifyPassword: Dispatch<SetStateAction<string>>,
) {
  return [
    {
      Icon: MdOutlineMail,
      placeholder: "email",
      value: email,
      type: "email" as const,
      setValue: setEmail,
      validation: z.string().email("Invalid email format"),
    },
    {
      Icon: FaRegUser,
      placeholder: "username",
      value: username,
      type: "text" as const,
      setValue: setUsername,
      validation: z.string().min(3, "Username must be at least 3 characters"),
    },
    {
      Icon: RiLock2Line,
      placeholder: "password",
      value: password,
      type: "password" as const,
      setValue: setPassword,
      validation: z.string().min(8, "Password must be at least 8 characters"),
    },
    {
      Icon: RiLock2Line,
      placeholder: "password2",
      value: verifyPassword,
      type: "password" as const,
      setValue: setVerifyPassword,
      validation: z.string().min(8, "Password must be at least 8 characters"),
    },
  ];
}
