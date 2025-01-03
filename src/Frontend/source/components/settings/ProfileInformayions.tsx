import { ImageCard } from './ImageCard';
import { CoverCard } from './CoverCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import { useState } from 'react';
import SettingsServices from '@/services/settingsServices';
const ProfileInformations = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  const [profileState, setProfileState] = useState({
    avatar: user?.avatar,
    cover: user?.cover,
    profileError: '',
    coverError: '',
    display_name: user?.display_name,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateState = (key: keyof typeof profileState, value: any) => {
    setProfileState((prev: any) => ({ ...prev, [key]: value }));
  };
  const imageSchema = z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(5 * 1024 * 1024),
  });
  const [isClicked, setIsClicked] = useState(false);
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
  function handleNamechange (e: React.ChangeEvent<HTMLInputElement>) {
    updateState('display_name', e.target.value);
  };
  function handleClick() {
    const Nameschema = z.object({
      display_name: z.string().min(3, 'Full name must be at least 3 characters'),

    });
    const validationResult = Nameschema.safeParse({
      display_name: profileState.display_name,

    });
    if (!validationResult.success) {
      const errorMap = validationResult.error.errors.reduce(
        (acc:any, err:any) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );
      setErrors(errorMap);
      return;
    }
    else {
      setErrors({});
      updateState('display_name', profileState.display_name);
      if(profileState.display_name !== user?.display_name) {
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
      console.log("Settings updated successfully:", response);
    } catch (error: any) {
      if (error.response?.data?.display_name?.length > 0) {
        setErrors({ display_name: error.response.data.display_name[0] });
      } else {
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    }
  }
  
  
  return (
    <div className="gap-10 border-2 bg-[#00000099] h-fit md:rounded-[50px] shadow-2xl md:p-6 border-[#B8B8B8]">
      <div className="w-full h-fit md:p-10 p-5 flex items-center">
        <h1 className="text-white font-dayson font-bold text-2xl tracking-wider border-b-2 transition-all duration-200">
          Profile Information
        </h1>
      </div>
      <div className="w-full 2xl:px-20 py-6 sm:pl-12 flex 2xl:gap-[170px] xl:gap-[100px] gap-[50px] items-center justify-start flex-wrap">
        <ImageCard
          selectedImage={profileState?.avatar}
          handleImageChange={handleImageChange}
          profileError={profileState.profileError}
        />

        <CoverCard
          coverImage={profileState.cover}
          handleCoverChange={handleCoverChange}
          coverError={profileState.coverError}
        />
      </div>
      <div className="w-full h-fit 2xl:pl-20 pl-2 py-6 flex 2xl:gap-20 xl:gap-10 md:gap-7 items-start justify-start sm:px-12 md:px-5 flex-col">
        <div className="w-fit flex flex-row lg:gap-[100px] gap-[50px]">
          <div className="w-fit flex flex-col gap-4">
            <label className="text-white text-sm">Username</label>
            <input
              type="text"
            value={user?.username}
            disabled
              className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed w-[150px] sm:w-[200px]"
            />
          </div>
          <div className="w-fit flex flex-col gap-4">
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
            value="user@example.com"
            disabled
              className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed w-[150px] sm:w-[200px]"
            />
          </div>
        </div>

          <div className="w-full h-full flex flex-row justify-between items-end">
          <div className="w-fit flex flex-row justify-between items-center gap-[100px]">
            <div className="w-fit flex flex-col gap-4">
              <label className="text-white text-sm">Display name</label>
              <input
                type="text"
            value={profileState.display_name}
            onChange={handleNamechange}
            className="py-2 px-4 bg-white text-black rounded-md outline-none w-[150px] sm:w-[200px]"
          />{
            errors.display_name && (
              <p className="text-red-500 text-sm">{errors.display_name}</p>
            )
          }
        </div>
          </div>
        </div>
        <div className="flex items-center justify-end w-full ">
        <button
          className={`${isClicked ? 'bg-green-500' : 'bg-white hover:bg-[#28AFB0]'} w-[150px] sm:w-[200px] h-[50px] sm:py-3 sm:px-6 text-black font-dayson rounded-md font-bold text-sm sm:text-lg hover:bg-opacity-[90%] transition-all duration-200`}
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
