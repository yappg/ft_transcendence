/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import React, { useState } from "react";
import Title from "@/components/auth/title";
import { Form, MyLink } from "@/components/auth/form";
import { getFields } from "./fieldes";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const fields = getFields(
    username,
    email,
    password,
    verifyPassword,
    setUsername,
    setEmail,
    setPassword,
    setVerifyPassword,
  );

  const buttonProps = {
    text: "Signup",
    onClick: () => {
      let result = "";
      fields.map((field) => (result += field.value + " "));
      alert(result);
    },
  };

  return (
    <div className="flex h-fit flex-col gap-2">
      <Title />
      <Form fields={fields} buttonProps={buttonProps} isSignup={true} />
      <MyLink text="Already have an account? " href="login" />
    </div>
  );
};

export default Signup;
