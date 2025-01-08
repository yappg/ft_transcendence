/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
import { Switch } from "@/components/ui/switch";
import { User } from "@/constants/chat";
import { useState } from "react";
import { Activate_2fa } from "./Activate_2fa";
import { z } from "zod";
import SettingsServices from "@/services/settingsServices";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export const SecurityComponent = () => {
  const router = useRouter();
  const passwordValidator = z.object({
    password: z.string(),
    newPassword: z.string().refine(
      (val: string) => {
        if (password === "") {
          return val === "";
        }
        return val.length >= 8;
      },
      {
        message:
          "New password must be provided and at least 8 characters when changing password",
      },
    ),
  });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({
    password: "",
    newPassword: "",
  });
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  const [currentEnabled2fa, setCurrentEnabled2fa] = useState(false);
  const [update2fa, setUpdate2fa] = useState(false);

  useEffect(() => {
    const get2fa = async () => {
      const response = await SettingsServices.get2fa();
      setCurrentEnabled2fa(response);
      setUpdate2fa(response);
    };
    get2fa();
  }, []);

  console.log("update2fa: ", update2fa);
  const handleClick = async () => {
    setErrors({});

    if (password === "" && newPassword !== "") {
      setErrors({
        newPassword: "Cannot set new password without current password",
      });
      return;
    }
    const result = passwordValidator.safeParse({ password, newPassword });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string>);
    } else {
      setErrors({});
      if (password !== "" && newPassword !== "") {
        try {
          await SettingsServices.updatePassword(password, newPassword);
          setIsClicked(true);
        } catch (error: any) {
          if (error.response?.data?.error?.[0]) {
            setErrors({ password: error.response.data.error[0] });
          } else {
            setErrors({
              password: "Failed to update password. Please try again.",
            });
          }
          setIsClicked(false);
        }
      }
    }
    if (errors.password === "" && errors.newPassword === "") {
      if (currentEnabled2fa === update2fa) {
        return;
      }
      if (update2fa) {
        setUpdate2fa(true);
        setCurrentEnabled2fa(true);
        router.push("/profile2fa/activate2Fa");
      } else {
        await SettingsServices.update2fa(false);
        setCurrentEnabled2fa(false);
        setUpdate2fa(false);
      }
    }
  };
  return (
    <div className="flex h-fit w-full flex-col items-center md:py-6 2xl:flex-row">
      <div className="flex w-full flex-col gap-8">
        <div className="flex h-[8%] w-full items-center">
          <h1 className="border-b-2 font-dayson text-2xl font-bold tracking-wider text-white transition-all duration-200">
            Security
          </h1>
        </div>
        <div className="flex h-fit w-full flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4 md:w-1/2 md:px-12">
            <label className="text-sm text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              className="w-[300px] rounded-md bg-gray-700 px-4 py-2 text-white outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <label className="text-sm text-white">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              onChange={handleNewPasswordChange}
              className="w-[300px] rounded-md bg-gray-700 px-4 py-2 text-white outline-none"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex h-[5%] w-full flex-col items-center justify-end gap-4">
        <Activate_2fa update2fa={update2fa} setUpdate2fa={setUpdate2fa} />
        <div className="flex h-[5%] w-full items-center justify-end">
          <button
            className={`${isClicked ? "bg-green-500" : "bg-white hover:bg-[#28AFB0]"} h-[50px] w-[250px] rounded-md px-6 py-3 font-dayson text-lg font-bold text-black transition-all duration-200 hover:bg-opacity-[90%]`}
            onClick={handleClick}
          >
            {isClicked ? "Updated" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};
