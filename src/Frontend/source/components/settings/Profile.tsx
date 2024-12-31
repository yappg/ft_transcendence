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
  return (
    <div className="size-full py-8 px-6 2xl:p-10 flex flex-col gap-8">
      <ProfileInformations />
      <SecurityComponent user={user} />
      <Activate_2fa />
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
