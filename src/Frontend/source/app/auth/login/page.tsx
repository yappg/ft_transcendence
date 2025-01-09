/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
"use client";
import React from "react";
import Title from "@/components/auth/title";
import { Form, MyLink } from "@/components/auth/form";
import { useState, Suspense } from "react";
import { getFields } from "./fields";

const LoadingComponent = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>Loading game arena...</div>
    </div>
  );
};

const LoginContent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const buttonAction = () => {
    console.log("clicked");
    let result = "";
    fields.map((field) => (result += field.value + ""));
  };
  const fields = getFields(username, password, setUsername, setPassword);
  const buttonProps = { text: "Login", onClick: buttonAction };
  return (
    <div className="flex h-auto flex-col gap-4">
      <Title />
      <Form fields={fields} buttonProps={buttonProps} isSignup={false} />
      <MyLink text="Have no account yet? " href="signup" />
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
