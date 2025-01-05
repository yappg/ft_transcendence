import { Switch } from '@/components/ui/switch';
import { User } from '@/constants/chat';
import { useState } from 'react';
import { Activate_2fa } from './Activate_2fa';
import { z } from 'zod';
import SettingsServices from '@/services/settingsServices';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export const SecurityComponent = () => {
  const router = useRouter();
  const passwordValidator = z.object({
    password: z.string(),
    newPassword: z.string().refine((val: string) => {
      if (password === '') {
        return val === '';
      }
      return val.length >= 8;
    }, {
      message: 'New password must be provided and at least 8 characters when changing password',
    }),
  });
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({
      password: '',
      newPassword: '',
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
    }
    get2fa();
  }, []);
  console.log('update2fa: ', update2fa);
  const handleClick = async () => {
    setErrors({});
    
    if (password === '' && newPassword !== '') {
      setErrors({ newPassword: 'Cannot set new password without current password' });
      return;
    }
    const result = passwordValidator.safeParse({ password, newPassword });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
    } else {
      setErrors({});
      if (password !== '' && newPassword !== '') {
        try {
          await SettingsServices.updatePassword(password, newPassword);
          setIsClicked(true);
        } catch (error: any) {
          if (error.response?.data?.error?.[0]) {
            setErrors({ password: error.response.data.error[0] });
          } else {
            setErrors({ password: 'Failed to update password. Please try again.' });
          }
          setIsClicked(false);
        }
      }
    }
    if (errors.password === '' && errors.newPassword === '') {
      if (currentEnabled2fa === update2fa) {
        return;
      }
      if (update2fa) {
        setUpdate2fa(true);
        setCurrentEnabled2fa(true);
        router.push('/signup-2fa');
      }
      else { 
        await SettingsServices.update2fa(false);
        setCurrentEnabled2fa(false);
        setUpdate2fa(false);
      }
    }
  };
  return (
    <div className="w-full md:py-6 flex 2xl:flex-row flex-col items-center h-fit">
      <div className="flex flex-col gap-8 w-full">
      <div className="w-full h-[8%] flex items-center">
        <h1 className="text-white font-dayson font-bold text-2xl tracking-wider border-b-2 transition-all duration-200">
          Security
        </h1>
      </div>
      <div className="w-full h-fit flex md:flex-row flex-col justify-between gap-4">
        <div className="md:w-[50%] flex flex-col gap-4 md:px-12">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={handlePasswordChange}
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none w-[300px]"
          />
           {errors.password && (<p className="text-red-500 text-sm">{errors.password}</p>)}
          <label className="text-white text-sm">New Password</label>
          <input
            type="password"
            placeholder="Enter your new password"
            onChange={handleNewPasswordChange}
            className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none w-[300px]"
          />
          {errors.newPassword && (<p className="text-red-500 text-sm">{errors.newPassword}</p>)}
        </div>
      </div>
      </div>
      <div className="w-full h-[5%] flex items-center justify-end flex-col gap-4">

      <Activate_2fa update2fa={update2fa} setUpdate2fa={setUpdate2fa} />
      <div className="w-full h-[5%] flex items-center justify-end">
        <button
          className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[250px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg hover:bg-opacity-[90%] transition-all duration-200`}
          onClick={handleClick}
        >
          {isClicked ? 'Updated' : 'Update'}
        </button>
      </div>
      </div>
    </div>
  );
};
