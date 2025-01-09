/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import React, { useState, Suspense } from "react";
import Title from "@/components/auth/title";
import { Form, MyLink } from "@/components/auth/form";
import { getFields } from "./fieldes";
const LoadingComponent = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>Loading ...</div>
    </div>
  );
};

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
    <Suspense fallback={<LoadingComponent />}>

      <div className="flex h-fit flex-col gap-2">
        <Title />
        <Form fields={fields} buttonProps={buttonProps} isSignup={true} />
        <MyLink text="Already have an account? " href="login" />
      </div>
    </Suspense>
  );


};

export default Signup;
