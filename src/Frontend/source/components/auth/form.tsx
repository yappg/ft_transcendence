/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import InputBar from './input-bar';
import { MyButton } from '@/components/generalUi/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Type definitions
type FieldType = 'input' | 'password' | 'email' | 'text' | 'number' | 'date';

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
const emailSchema = z.string().email('Invalid email format');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const usernameSchema = z.string().min(3, 'Username must be at least 3 characters');

// API client
class AuthClient {
  private static readonly BASE_URL = 'http://backend:8080/api/auth';
  private static async fetchWithAuth(endpoint: string, data: Record<string, any>) {
    try {
      const response = await fetch(`${this.BASE_URL}/${endpoint}/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.non_field_errors || 'Authentication failed');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Authentication error:', error.message);
        throw new Error(`Authentication error: ${error.message}`);
      }
      throw new Error('Authentication failed');
    }
  }

  static async signup(data: Record<string, any>) {
    return this.fetchWithAuth('signup', data);
  }

  static async signin(data: Record<string, any>) {
    return this.fetchWithAuth('signin', data);
  }
}

// Components
export const MyLink: React.FC<MyLinkProps> = ({ text, href }) => {
  return (
    <div className="flex h-16 w-full items-center justify-center">
      <p className="text-[rgb(0,0,0,0.6)] dark:text-[rgb(255,255,255,0.6)]">
        {text}
        <Link
          href={`/auth/${href}`}
          className="text-primary dark:text-primary-dark font-bold hover:underline"
        >
          {href}
        </Link>
      </p>
    </div>
  );
};

export const Form: React.FC<FormProps> = ({ fields, buttonProps, isSignup, redirPath }) => {
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
      const passwordField = fields.find((f) => f.placeholder === 'password');
      const confirmPasswordField = fields.find((f) => f.placeholder === 'password2');

      if (
        passwordField &&
        confirmPasswordField &&
        passwordField.value !== confirmPasswordField.value
      ) {
        newErrors.confirmPassword = 'Passwords do not match';
        newErrors[fields[3].placeholder] = 'Passwords do not match';
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
      {} as Record<string, string>
    );

    try {
      const response = await (isSignup ? AuthClient.signup(formData) : AuthClient.signin(formData));

      toast({
        title: 'Success',
        description: isSignup ? 'Account created successfully' : 'Logged in successfully',
        className: 'bg-primary border-none text-white',
      });

      // Redirect to dashboard or home page
      router.push(redirPath || '/');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
        className: 'bg-primary-dark border-none text-white',
      });
      router.push(redirPath || '/');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-8 sm:px-12 md:px-20 md:py-16 lg:px-5 lg:py-2">
      <form className="flex size-full flex-col items-start gap-8" onSubmit={handleSubmit}>
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
                    [field.placeholder]: error || '',
                  }));
                }}
              />
              {errors[field.placeholder] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.placeholder]}</p>
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
