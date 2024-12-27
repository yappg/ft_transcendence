import { useEffect, useState } from 'react';
import { CoverCard } from './CoverCard';
import { Switch } from '@/components/ui/switch';
import { ImageCard } from './ImageCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import ProfileInformations from './ProfileInformayions';
import { SecurityComponent }from './SecurityComponent';

export default function ProfileInfo() {
  const { user } = useUser();
  if (!user) {
    return <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-white text-2xl">Loading...</h1>
    </div>;
  }
  const [isClicked, setIsClicked] = useState(false);
  console.log("user settings: ", user);
  const [profileState, setProfileState] = useState({
    selectedImage: user.avatar,
    coverImage: user.cover,
    profileError: '',
    coverError: '',
    fullName: user.display_name,
    password: '',
    NewPassword: '',
  });
  const [profile, setProfile] = useState({
    selectedImage: null as string | null,
    coverImage: null as string | null,
    fullName: '',
    password: '',
    NewPassword: '',
  });
  const imageSchema = z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(5 * 1024 * 1024),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateState = (key: keyof typeof profileState, value: any) => {
    setProfileState((prev) => ({ ...prev, [key]: value }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationResult = imageSchema.safeParse({
        type: file.type,
        size: file.size,
      });

      if (!validationResult.success) {
        updateState('profileError', 'Invalid file type or size. Max size 5MB.');
        updateState('selectedImage', null);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      updateState('selectedImage', imageUrl);
      updateState('profileError', '');
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationResult = imageSchema.safeParse({
        type: file.type,
        size: file.size,
      });

      if (!validationResult.success) {
        updateState('coverError', 'Invalid file type or size. Max size 5MB.');
        updateState('coverImage', null);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      updateState('coverImage', imageUrl);
      updateState('coverError', '');
    }
  };
  const handleClick = () => {
    const Updateschema = z.object({
      fullname: z.string().min(3, 'Full name must be at least 3 characters'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      NewPassword: z.string().min(6, 'Password must be at least 6 characters'),
    });

    const result = Updateschema.safeParse({
      fullname: profileState.fullName,
      password: profileState.password,
      NewPassword: profileState.NewPassword,
    });

    if (!result.success) {
      const errorMap = result.error.errors.reduce(
        (acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );
      setErrors(errorMap);
      return;
    } else {
      setErrors({});
      const updatedProfile = {
        selectedImage: profileState.selectedImage,
        coverImage: profileState.coverImage,
        fullName: profileState.fullName,
        password: profileState.password,
        NewPassword: profileState.NewPassword,
      };
      setProfile(updatedProfile);
      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, 4000);
    }
  };
  useEffect(() => {
    console.log(profile);
  }, [profile]);
  return (
    <div className="size-full py-8 px-6 lg:p-10">
      <div className="custom-scrollbar-container overflow-y-scroll">
        <ProfileInformations  user={user}/>
      <div className="h-fit gap-[200px]">
        <SecurityComponent user={user}/>
        <div className="flex flex-col w-full h-fit gap-[50px] py-6 justify-between">
          <div className="2xl:w-[50%] h-full flex justify-start flex-col gap-10">
            <div className="w-full h-[12%] flex items-center">
              <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
                Two Factor Authentication
              </h1>
            </div>
            <div className="w-full h-[50%] 2xl:pl-16 xl:pl-10 flex items-start justify-between flex-col">
              <p className="font-coustard text-lg text-white opacity-[80%]">
                Two Factor Authentication protects your account by <br />
                requiring an additional code when you log in on a new device.<br />
              </p>
              <div className="w-full h-[50%] flex items-center justify-start flex-row gap-5">
                <h1 className="font-coustard text-xl text-white">Activate 2FA</h1>
                <Switch />
              </div>
            </div>
          </div>
          <div className="w-[30%] h-full flex items-center justify-center">
            <button
              className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[200px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg hover:bg-opacity-[90%] transition-all duration-200`}
              onClick={handleClick}
            >
              {isClicked ? 'Updated' : 'Update'}
            </button>
          </div>
          </div>
          </div>
      </div>
    </div>
  );
}
