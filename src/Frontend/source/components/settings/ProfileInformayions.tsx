import { ImageCard } from './ImageCard';
import { CoverCard } from './CoverCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';
import { useState } from 'react';
const ProfileInformations = () => {
  const { user } = useUser();
  const [profileState, setProfileState] = useState({
    avatar: user?.avatar,
    cover: user?.cover,
    profileError: '',
    coverError: '',
    username: '',
    display_name: user?.display_name,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  if (!user) {
    return null;
  }
  const imageSchema = z.object({
    type: z.enum(['image/jpeg', 'image/png']),
    size: z.number().max(5 * 1024 * 1024),
  });
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
        updateState('avatar', null);
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      updateState('avatar', imageUrl);
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
        (acc, err) => {
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
    }
  }
  return (
    <div className="gap-10 border-2 bg-[#00000099] h-fit rounded-[50px] shadow-2xl md:p-6 sm:p-9 p-14 border-[#B8B8B8]">
      <div className="w-full h-[12%] flex items-center">
        <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
          Profile Information
        </h1>
      </div>
      <div className="w-full 2xl:px-20 py-6 flex sm:gap-[100px] gap-[50px] items-center justify-start flex-wrap">
        <ImageCard
          selectedImage={user?.avatar}
          handleImageChange={handleImageChange}
          profileError={user.profileError}
        />

        <CoverCard
          coverImage={user.cover}
          handleCoverChange={handleCoverChange}
          coverError={user.coverError}
        />
      </div>
      <div className="w-full h-fit 2xl:px-20 py-6 flex 2xl:gap-20 xl:gap-10 lg:gap-7 items-start justify-start sm:px-12 lg:flex-row flex-col">
        <div className="w-fit flex flex-col gap-4">
          <label className="text-white text-sm">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed"
          />
          <label className="text-white text-sm">Email</label>
          <input
            type="email"
            value="user@example.com"
            disabled
            className="py-2 px-4 bg-gray-700 text-white rounded-md cursor-not-allowed"
          />
        </div>

        <div className="w-fit h-full  flex flex-col gap-4 ">
          <label className="text-white text-sm">Display name</label>
          <input
            type="text"
            value={profileState.display_name}
            onChange={handleNamechange}
            className="py-2 px-4 bg-white text-black rounded-md outline-none"
          />{
            errors.display_name && (
              <p className="text-red-500 text-sm">{errors.display_name}</p>
            )
          }
        </div>
        <div className="w-full h-fit flex items-center justify-center">
          <button
            className="w-[200px] h-[50px] py-3 px-6 text-black font-dayson rounded-md font-bold text-lg bg-white hover:bg-[#28AFB0] hover:bg-opacity-[90%] transition-all duration-200"
            onClick={handleClick}
          >
            Save
          </button>
          </div>
      </div>
    </div>
  );
};
export default ProfileInformations;
