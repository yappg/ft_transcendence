import { Dispatch, SetStateAction, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { RiLock2Line } from "react-icons/ri";
import { z } from "zod";

export function getFields(
  username: string,
  password: string,
  setUsername: Dispatch<SetStateAction<string>>,
  setPassword: Dispatch<SetStateAction<string>>,
) {
  return [
    {
      Icon: FaRegUser,
      placeholder: "username",
      value: username,
      type: "input" as const,
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
  ];
}
