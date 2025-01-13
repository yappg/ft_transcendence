import { ImageCard } from "./ImageCard";
import { CoverCard } from "./CoverCard";
import { z } from "zod";
import { useUser } from "@/context/GlobalContext";
import { useState } from "react";
import SettingsServices from "@/services/settingsServices";
import { userService } from "@/services/userService";

const ProfileInformations = () => {
  const { user, setUser } = useUser();

  const [profileState, setProfileState] = useState({
    display_name: user?.display_name,
    avatar: user?.avatar,
    cover: user?.cover,
  });
  const [display_name, setDisplayName] = useState<string | null>(
    user?.display_name || "",
  );
  const [avatar_upload, setAvatarUpload] = useState<File | null>(null);
  const [cover_upload, setCoverUpload] = useState<File | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  if (!user) {
    return null;
  }
  const updateState = (key: keyof typeof profileState, value: any) => {
    setProfileState((prev: any) => ({ ...prev, [key]: value }));
  };
  const imageSchema = z.object({
    type: z.enum(["image/jpeg", "image/png"]),
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
        setAvatarUpload(null);
        setProfileError("Invalid file type or size");
        return;
      }
      setAvatarUpload(file);
      setProfileError(null);
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
        setCoverUpload(null);
        setCoverError("Invalid file type or size");
        return;
      }

      setCoverUpload(file);
      setCoverError(null);
    }
  };
  function handleNamechange(e: React.ChangeEvent<HTMLInputElement>) {
    setDisplayName(e.target.value);
  }
  function handleClick() {
    setProfileError(null);
    send_data();
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 3000);
  }
  async function send_data() {
    try {
      const formData = new FormData();
      if (display_name && display_name !== user?.display_name) {
        formData.append("display_name", display_name);
      }
      if (avatar_upload) {
        formData.append("avatar_upload", avatar_upload);
      }
      if (cover_upload) {
        formData.append("cover_upload", cover_upload);
      }
      formData.append("errors", JSON.stringify(profileError));
      const response = await SettingsServices.updateSettings(formData);
      updateState("display_name", display_name);
      const userData = await userService.getUserProfile();
      setUser(userData);
    } catch (error: any) {
      if (
        error.response?.data?.display_name?.length > 0 ||
        error.response?.data?.avatar_upload?.length > 0 ||
        error.response?.data?.cover_upload?.length > 0
      ) {
        if (error.response?.data?.display_name?.length > 0) {
          setProfileError(error.response.data.display_name[0]);
        }
        if (error.response?.data?.avatar_upload?.length > 0) {
          setAvatarError(error.response.data.avatar_upload[0]);
        }
        if (error.response?.data?.cover_upload?.length > 0) {
          setCoverError(error.response.data.cover_upload[0]);
        }
      } else {
        setProfileError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="h-fit gap-10 border-2 border-[#B8B8B8] bg-[#00000099] shadow-2xl md:rounded-[50px] md:p-6">
      <div className="flex h-fit w-full items-center p-5 md:p-10">
        <h1 className="border-b-2 font-dayson text-2xl font-bold tracking-wider text-white transition-all duration-200">
          Profile Information
        </h1>
      </div>
      <div className="flex w-full flex-wrap items-center justify-start gap-[50px] py-6 sm:pl-12 xl:gap-[100px] 2xl:gap-[170px] 2xl:px-20">
        <CoverCard
          coverImage={
            cover_upload ? URL.createObjectURL(cover_upload) : user?.cover
          }
          handleCoverChange={handleCoverChange}
          coverError={coverError || ""}
        />
        <ImageCard
          selectedImage={
            avatar_upload ? URL.createObjectURL(avatar_upload) : user?.avatar
          }
          handleImageChange={handleImageChange}
          profileError={avatarError || ""}
        />
      </div>
      <div className="flex h-fit w-full flex-col items-start justify-start py-6 pl-2 sm:px-12 md:gap-7 md:px-5 xl:gap-10 2xl:gap-20 2xl:pl-20">
        <div className="flex w-fit flex-row gap-[50px] lg:gap-[80px]">
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
            <label className="text-sm text-white">Display name</label>
            <input
              type="text"
              value={display_name || ""}
              onChange={handleNamechange}
              className="w-[150px] rounded-md bg-white px-4 py-2 text-black outline-none sm:w-[200px]"
            />
            {profileError && (
              <p className="text-sm text-red-500">{profileError}</p>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            className={`${isClicked ? "bg-green-500" : "bg-white hover:bg-[#28AFB0]"} h-[50px] w-[150px] rounded-md font-dayson text-sm font-bold text-black transition-all duration-200 hover:bg-opacity-[90%] sm:w-[200px] sm:px-6 sm:py-3 sm:text-lg`}
            onClick={handleClick}
          >
            {isClicked ? "Updated" : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileInformations;
