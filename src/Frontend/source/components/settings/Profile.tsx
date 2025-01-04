import { useEffect, useState } from 'react';
import { CoverCard } from './CoverCard';
import { Activate_2fa } from './Activate_2fa';
import { ImageCard } from './ImageCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import ProfileInformations from './ProfileInformayions';
import { SecurityComponent } from './SecurityComponent';
import SettingsServices from '@/services/settingsServices';
import { IconLock } from '@tabler/icons-react';
import { IconLockOpen2 } from '@tabler/icons-react';
import { Switch } from '../ui/switch';

export default function ProfileInfo() {
  const { user } = useUser();
  const [privacy, setPrivacy] = useState(false);
  const [enabled2fa, setEnabled2fa] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    const get2fa = async () => {
      const response = await SettingsServices.get2fa();
      setEnabled2fa(response);
    }
    get2fa();
  }, []);
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }
  // const [profileState, setProfileState] = useState({
  //   avatar: user?.avatar,
  //   cover: user?.cover,
  //   profileError: '',
  //   coverError: '',
  //   username: user?.username,
  //   display_name: user?.display_name,
  //   password: '',
  //   NewPassword: '',
  //   is_private: user?.is_private,
  // });
  // const [errors, setErrors] = useState<Record<string, string>>({});
  // const handleClick = () => {
  //   const Nameschema = z.object({
  //     display_name: z.string().min(3, 'Display name must be at least 3 characters'),
  //     password: z
  //   .string()
  //   .refine((val: any) => val === '' || val.length >= 6, {
  //     message: 'Password must be at least 6 characters or empty',
  //   }),
  // NewPassword: z
  //   .string()
  //   .refine((val: any) => val === '' || val.length >= 6, {
  //     message: 'New Password must be at least 6 characters or empty',
  //   }),
  //   });

  //   const validationResult = Nameschema.safeParse({
  //     display_name: profileState.display_name,
  //     password: profileState.password,
  //     NewPassword: profileState.NewPassword,
  //   });

  //   if (!validationResult.success) {
  //     const errorMap = validationResult.error.errors.reduce(
  //       (acc: any, err: any) => {
  //         acc[err.path[0]] = err.message;
  //         return acc;
  //       },
  //       {} as Record<string, string>
  //     );
  //     setErrors(errorMap);
  //     return;
  //   } else {
  //     setErrors({});
  //     console.log(profileState);
  //     const updatedProfileState = {
  //       selectedImage: profileState.avatar,
  //       coverImage: profileState.cover,
  //       username: profileState.username,
  //       password: profileState.password,
  //       NewPassword: profileState.NewPassword,
  //     };
  //     setProfileState(updatedProfileState as any);
  //     SettingsServices.updateSettings(updatedProfileState);
  //     setIsClicked(true);
  //     setTimeout(() => {
  //       setIsClicked(false);
  //     }, 4000);
  //   }
  // };

  const handlePrivacy = async () => {
    const newPrivacyState = !privacy;
    setPrivacy(newPrivacyState);
    await SettingsServices.updatePrivacy(newPrivacyState);
  };
  return (
    <div className="size-full md:py-8 md:px-6 2xl:p-10 flex flex-col md:gap-8">
      <ProfileInformations />
      <div className="w-full h-fit flex flex-col gap-16 border-2 bg-[#00000099] md:rounded-[50px] shadow-2xl p-7 border-[#B8B8B8]">
        <div className="w-full h-[8%] flex items-center">
        <h1 className="text-white font-dayson font-bold text-2xl tracking-wider border-b-2 transition-all duration-200">
          Profile Privacy
        </h1>
      </div>
        <div className=" 2xl:px-20 py-6 w-full h-fit flex flex-row gap-9">
        {privacy ? <IconLock stroke={1.75} className="text-white"/> : <IconLockOpen2 stroke={1.75} className="text-white"/>}
        <h1 className="font-coustard text-xl text-white">Private Profile</h1>
        <Switch checked={privacy} onCheckedChange={handlePrivacy}/>
        </div>
        {/* <div className="w-full h-[5%] flex items-center justify-end">
        <button
          className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[200px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg hover:bg-opacity-[90%] transition-all duration-200`}
          onClick={handleClick}
        >
          {isClicked ? 'Updated' : 'Update'}
        </button>
      </div> */}
      </div>
      <div className="w-full h-fit flex flex-col gap-4 border-2 bg-[#00000099] md:rounded-[50px] shadow-2xl p-7 border-[#B8B8B8]">
        <div className="w-full h-fit flex flex-row gap-4">
      <SecurityComponent />
      {/* <Activate_2fa enabled2fa={enabled2fa} /> */}
      </div>
      {/* <div className="w-[30%] h-[5%] flex items-center justify-end">
        <button
          className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[250px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg hover:bg-opacity-[90%] transition-all duration-200`}
          // onClick={handleClick}
        >
          {isClicked ? 'Updated' : 'Update'}
        </button>
      </div> */}
      </div>
    </div>
  );
}
