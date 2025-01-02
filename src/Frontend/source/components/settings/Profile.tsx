import { useEffect, useState } from 'react';
import { CoverCard } from './CoverCard';
import { Activate_2fa } from './Activate_2fa';
import { ImageCard } from './ImageCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import ProfileInformations from './ProfileInformayions';
import { SecurityComponent } from './SecurityComponent';

export default function ProfileInfo() {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }
  const [isClicked, setIsClicked] = useState(false);
  const [profileState, setProfileState] = useState({
    avatar: user?.avatar,
    cover: user?.cover,
    profileError: '',
    coverError: '',
    username: user?.username,
    display_name: user?.display_name,
    password: '',
    NewPassword: '',
    is_private: user?.is_private,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateState = (key: keyof typeof profileState, value: any) => {
    setProfileState((prev: any) => ({ ...prev, [key]: value }));
  };
  const handleClick = () => {
    const Nameschema = z.object({
      display_name: z.string().min(3, 'Display name must be at least 3 characters'),
      password: z
    .string()
    .refine((val: any) => val === '' || val.length >= 6, {
      message: 'Password must be at least 6 characters or empty',
    }),
  NewPassword: z
    .string()
    .refine((val: any) => val === '' || val.length >= 6, {
      message: 'New Password must be at least 6 characters or empty',
    }),
    });

    const validationResult = Nameschema.safeParse({
      display_name: profileState.display_name,
      password: profileState.password,
      NewPassword: profileState.NewPassword,
    });

    if (!validationResult.success) {
      const errorMap = validationResult.error.errors.reduce(
        (acc: any, err: any) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );
      setErrors(errorMap);
      return;
    } else {
      setErrors({});
      console.log(profileState);
      const updatedProfileState = {
        selectedImage: profileState.avatar,
        coverImage: profileState.cover,
        username: profileState.username,
        password: profileState.password,
        NewPassword: profileState.NewPassword,
      };
      setProfileState(updatedProfileState as any);
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 4000);
    }
  };
  return (
    <div className="size-full py-8 px-6 2xl:p-10 flex flex-col gap-8">
      <ProfileInformations profileState={profileState} setProfileState={setProfileState} errors={errors} setErrors={setErrors} />
      <SecurityComponent  profileState={profileState} setProfileState={setProfileState} errors={errors} setErrors={setErrors}/>
      <Activate_2fa  profileState={profileState} setProfileState={setProfileState}/>
      <div className="w-[30%] h-[5%] flex items-center justify-center">
        <button
          className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[200px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg hover:bg-opacity-[90%] transition-all duration-200`}
          onClick={handleClick}
        >
          {isClicked ? 'Updated' : 'Update'}
        </button>
      </div>
    </div>
  );
}
