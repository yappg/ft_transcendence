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
  const [privacy, setPrivacy] = useState(user?.is_private);
  useEffect(() => {
    if (user?.is_private !== undefined) {
      setPrivacy(user.is_private);
    }
  }, [user?.is_private]);
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }
  const handlePrivacy = async () => {
    const newPrivacyState = !privacy;
    setPrivacy(newPrivacyState);
    console.log('newPrivacyState: ', newPrivacyState);
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
      </div>
      <div className="w-full h-fit flex flex-col gap-4 border-2 bg-[#00000099] md:rounded-[50px] shadow-2xl p-7 border-[#B8B8B8]">
        <div className="w-full h-fit flex flex-row gap-4">
      <SecurityComponent />
      </div>
      </div>
    </div>
  );
}
