import { useEffect, useState } from 'react';
import { CoverCard } from './CoverCard';
import { Switch } from '@/components/ui/switch';
import { ImageCard } from './ImageCard';
import { z } from 'zod';
import { useUser } from '@/context/GlobalContext';

export default function ProfileInfo() {
  const { user } = useUser();
  const [isClicked, setIsClicked] = useState(false);
  console.log(user);
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
    console.log(profileState);
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
    <div className="size-full p-10">
      <div className="custom-scrollbar-container overflow-y-scroll">
      <div className="gap-10">
        <div className="w-full h-[12%] flex items-center">
          <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200 ">
            Profile Information
          </h1>
        </div>
        <div className="w-full 2xl:px-10 py-6 flex gap-[100px] items-center justify-start flex-wrap ">
          <ImageCard
            handleDeleteImage={() => {
              updateState('selectedImage', null);
              // setProfileError('');
            }}
            selectedImage={profileState.ProfilePhoto1}
            handleImageChange={handleImageChange}
            profileError={profileState.profileError}
          />

          <CoverCard
            coverImage={profileState.coverImage}
            handleCoverChange={handleCoverChange}
            coverError={profileState.coverError}
          />
        </div>
        <div className="w-full h-fit 2xl:px-20 py-6 flex flex-wrap 2xl:gap-32 xl:gap-10 lg:gap-7 items-start justify-start px-12">
          <div className="w-fit flex flex-col gap-4">
            <label className="text-white text-sm">Username</label>
            <input
              type="text"
              value="username123"
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

          <div className="w-fit h-full  flex flex-col gap-4">
            <label className="text-white text-sm">Display name</label>
            <input
              type="text"
              value={profileState.fullName}
              onChange={(e) => {
                updateState('fullName', e.target.value);
              }}
              className="py-2 px-4 bg-white text-black rounded-md outline-none"
            />
            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
          </div>
        </div>
      </div>
      <div className="h-[60%] gap-[200px]">
        <div className="w-full py-6 flex flex-wrap items-center justify-start h-[40%] gap-10">
          <div className="w-full h-[8%] flex items-center">
            <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
              Security
            </h1>
          </div>
          <div className="w-fit flex flex-col gap-4 2xl:px-20 px-12">
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={profileState.password}
              onChange={(e) => updateState('password', e.target.value)}
              className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
            />
            <label className="text-white text-sm">New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={profileState.NewPassword}
              onChange={(e) => updateState('NewPassword', e.target.value)}
              className="py-2 px-4 bg-gray-700 text-white rounded-md outline-none"
            />
            {errors.NewPassword && <p className="text-red-500 text-sm">{errors.NewPassword}</p>}
          </div>
        </div>
        <div className="flex flex-row w-full h-[60%] py-6 justify-between">
          <div className="2xl:w-[50%] h-full flex justify-start flex-col gap-10">
            <div className="w-full h-[12%] flex items-center">
              <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
                Two Factor Authentication
              </h1>
            </div>
            <div className="w-full h-[50%] 2xl:pl-16 xl:pl-10 flex items-start justify-between flex-col">
              <p className="font-coustard text-lg text-white opacity-[80%]">
                Two Factor Authentication protects your account by <br />
                requiring an additional ode when you log in on a new device.<br />
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
