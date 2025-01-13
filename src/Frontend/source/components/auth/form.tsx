/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import React from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import InputBar from "./input-bar";
import { MyButton } from "@/components/generalUi/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthClient } from "@/services/fetch-auth";

type FieldType = "input" | "password" | "email" | "text" | "number" | "date";

interface FormField {
  Icon: React.ElementType;
  placeholder: string;
  value: string;
  type: FieldType;
  setValue: (value: string) => void;
  validation?: z.ZodType<any>;
}

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

interface FormProps {
  fields: FormField[];
  buttonProps: ButtonProps;
  isSignup: boolean;
  redirPath?: string;
}

interface MyLinkProps {
  text: string;
  href: string;
}

// Validation schemas
const emailSchema = z.string().email("Invalid email format");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters");
const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters");

export const MyLink: React.FC<MyLinkProps> = ({ text, href }) => {
  return (
    <div className="flex h-16 w-full items-center justify-center">
      <p className="text-[rgb(0,0,0,0.6)] dark:text-[rgb(255,255,255,0.6)]">
        {text}
        <Link
          href={`/auth/${href}`}
          className="font-bold text-primary hover:underline dark:text-primary-dark"
        >
          {href}
        </Link>
      </p>
    </div>
  );
};

export const Form: React.FC<FormProps> = ({
  fields,
  buttonProps,
  isSignup,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: FormField): string | null => {
    if (field.validation) {
      try {
        field.validation.parse(field.value);
        return null;
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors[0].message;
        }
      }
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field.placeholder] = error;
      }
    });

    if (isSignup) {
      const passwordField = fields.find((f) => f.placeholder === "password");
      const confirmPasswordField = fields.find(
        (f) => f.placeholder === "password2",
      );

      if (
        passwordField &&
        confirmPasswordField &&
        passwordField.value !== confirmPasswordField.value
      ) {
        newErrors.confirmPassword = "Passwords do not match";
        newErrors[fields[3].placeholder] = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    const formData = fields.reduce(
      (acc, field) => {
        acc[field.placeholder] = field.value;
        return acc;
      },
      {} as Record<string, string>,
    );

    try {
      const response = await (isSignup
        ? AuthClient.signup(formData)
        : AuthClient.signin(formData));

      if (response.message) {
        localStorage.setItem("username", formData.username);
        toast({
          title: "Success",
          description: isSignup
            ? "Account created successfully"
            : "Logged in successfully",
          className: "bg-primary border-none text-white bg-opacity-20",
          duration: 5000,
        });
        if (response.enabled_2fa === "True") {
          router.push("/2fa/login-2fa");
          return;
        }
        return router.push("/home");
      }
      if (response.error)
        toast({
          title: "Authentication failed",
          description: response.error,
          variant: "destructive",
          className: "bg-primary-dark border-none text-white bg-opacity-20",
        });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Oups Somthing went wrong !",
        variant: "destructive",
        className: "bg-primary-dark border-none text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-12 md:px-20 md:py-16 lg:px-5 lg:py-2">
      <form
        className="flex size-full flex-col items-start gap-8"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full flex-col gap-5">
          {fields.map((field) => (
            <div key={field.placeholder} className="w-full">
              <InputBar
                Icon={field.Icon}
                placeholder={field.placeholder}
                value={field.value}
                type={field.type}
                setValue={field.setValue}
                error={errors[field.placeholder]}
                onBlur={() => {
                  const error = validateField(field);
                  setErrors((prev) => ({
                    ...prev,
                    [field.placeholder]: error || "",
                  }));
                }}
              />
              {errors[field.placeholder] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[field.placeholder]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center lg:justify-start lg:pl-8">
          <MyButton
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px] disabled:opacity-50"
          >
            {buttonProps.text}
          </MyButton>
        </div>
      </form>
    </div>
  );
};
