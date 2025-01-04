import { ImageCard } from './ImageCard';
import { CoverCard } from './CoverCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import { useState } from 'react';
import SettingsServices from '@/services/settingsServices';
const ProfileInformations = () => {
  const { user } = useUser();
  const [profileState, setProfileState] = useState({
    avatar: user?.avatar,
    cover: user?.cover,
    profileError: '',
    coverError: '',
    display_name: user?.display_name,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClicked, setIsClicked] = useState(false);

  if (!user) {
    return null;
  }
  const updateState = (key: keyof typeof profileState, value: any) => {
    setProfileState((prev: any) => ({ ...prev, [key]: value }));
  };
  const imageSchema = z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(5 * 1024 * 1024),
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationResult = imageSchema.safeParse({
        type: file.type,
        size: file.size,
      });

      if (!validationResult.success) {
        updateState('profileError', 'Invalid file type or size. Max size 5MB.');
        updateState('avatar', null);
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      updateState('avatar', imageUrl);
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
        updateState('cover', null);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      updateState('cover', imageUrl);
      updateState('coverError', '');
    }
  };
  function handleNamechange(e: React.ChangeEvent<HTMLInputElement>) {
    updateState('display_name', e.target.value);
  }
  function handleClick() {
    const Nameschema = z.object({
      display_name: z.string().min(3, 'Full name must be at least 3 characters'),
    });
    const validationResult = Nameschema.safeParse({
      display_name: profileState.display_name,
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
      updateState('display_name', profileState.display_name);
      if (profileState.display_name !== user?.display_name) {
        send_data();
        setIsClicked(true);
        setTimeout(() => {
          setIsClicked(false);
        }, 3000);
      }
    }
  }
  async function send_data() {
    try {
      const response = await SettingsServices.updateSettings(profileState);
      console.log('Settings updated successfully:', response);
    } catch (error: any) {
      if (error.response?.data?.display_name?.length > 0) {
        setErrors({ display_name: error.response.data.display_name[0] });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  }

  return (
    <div className="h-fit gap-10 border-2 border-[#B8B8B8] bg-[#00000099] shadow-2xl md:rounded-[50px] md:p-6">
      <div className="flex h-fit w-full items-center p-5 md:p-10">
        <h1 className="font-dayson border-b-2 text-2xl font-bold tracking-wider text-white transition-all duration-200">
          Profile Information
        </h1>
      </div>
      <div className="flex w-full flex-wrap items-center justify-start gap-[50px] py-6 sm:pl-12 xl:gap-[100px] 2xl:gap-[170px] 2xl:px-20">
        <ImageCard
          selectedImage={profileState?.avatar || ''}
          handleImageChange={handleImageChange}
          profileError={profileState.profileError}
        />

        <CoverCard
          coverImage={profileState.cover || ''}
          handleCoverChange={handleCoverChange}
          coverError={profileState.coverError}
        />
      </div>
      <div className="flex h-fit w-full flex-col items-start justify-start py-6 pl-2 sm:px-12 md:gap-7 md:px-5 xl:gap-10 2xl:gap-20 2xl:pl-20">
        <div className="flex w-fit flex-row gap-[50px] lg:gap-[100px]">
          <div className="flex w-fit flex-col gap-4">
            <label className="text-sm text-white">Username</label>
            <input
              type="text"
              value={user?.username}
              disabled
              className="w-[150px] cursor-not-allowed rounded-md bg-gray-700 px-4 py-2 text-white sm:w-[200px]"
            />
          </div>
          <div className="flex w-fit flex-col gap-4">
            <label className="text-sm text-white">Email</label>
            <input
              type="email"
              value="user@example.com"
              disabled
              className="w-[150px] cursor-not-allowed rounded-md bg-gray-700 px-4 py-2 text-white sm:w-[200px]"
            />
          </div>
        </div>

        <div className="flex size-full flex-row items-end justify-between">
          <div className="flex w-fit flex-row items-center justify-between gap-[100px]">
            <div className="flex w-fit flex-col gap-4">
              <label className="text-sm text-white">Display name</label>
              <input
                type="text"
                value={profileState.display_name}
                onChange={handleNamechange}
                className="w-[150px] rounded-md bg-white px-4 py-2 text-black outline-none sm:w-[200px]"
              />
              {errors.display_name && <p className="text-sm text-red-500">{errors.display_name}</p>}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-end ">
          <button
            className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} font-dayson h-[50px] w-[150px] rounded-md text-sm font-bold text-black transition-all duration-200 hover:bg-opacity-[90%] sm:w-[200px] sm:px-6 sm:py-3 sm:text-lg`}
            onClick={handleClick}
          >
            {isClicked ? 'Updated' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileInformations;
