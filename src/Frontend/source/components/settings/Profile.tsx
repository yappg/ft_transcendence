import { useEffect, useState } from "react";
/* eslint-disable tailwindcss/no-custom-classname */
import { CoverCard } from "./CoverCard";
import { Activate_2fa } from "./Activate_2fa";
import { ImageCard } from "./ImageCard";
import { z } from "zod";
import { useUser } from "@/context/GlobalContext";
import ProfileInformations from "./ProfileInformayions";
import { SecurityComponent } from "./SecurityComponent";
import SettingsServices from "@/services/settingsServices";
import { IconLock } from "@tabler/icons-react";
import { IconLockOpen2 } from "@tabler/icons-react";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";

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
      <Skeleton className="size-full rounded-md bg-black-crd" />
    );
  }
  const handlePrivacy = async () => {
    const newPrivacyState = !privacy;
    setPrivacy(newPrivacyState);
    console.log("newPrivacyState: ", newPrivacyState);
    await SettingsServices.updatePrivacy(newPrivacyState);
  };
  return (
    <div className="flex size-full flex-col md:gap-8 md:px-6 md:py-8 2xl:p-10">
      <ProfileInformations />
      <div className="flex h-fit w-full flex-col gap-16 border-2 border-[#B8B8B8] bg-[#00000099] p-7 shadow-2xl md:rounded-[50px]">
        <div className="flex h-[8%] w-full items-center">
          <h1 className="border-b-2 font-dayson text-2xl font-bold tracking-wider text-white transition-all duration-200">
            Profile Privacy
          </h1>
        </div>
        <div className="flex h-fit w-full flex-row gap-9 py-6 2xl:px-20">
          {privacy ? (
            <IconLock stroke={1.75} className="text-white" />
          ) : (
            <IconLockOpen2 stroke={1.75} className="text-white" />
          )}
          <h1 className="font-coustard text-xl text-white">Private Profile</h1>
          <Switch checked={privacy} onCheckedChange={handlePrivacy} />
        </div>
      </div>
      <div className="flex h-fit w-full flex-col gap-4 border-2 border-[#B8B8B8] bg-[#00000099] p-7 shadow-2xl md:rounded-[50px]">
        <div className="flex h-fit w-full flex-row gap-4">
          <SecurityComponent />
        </div>
      </div>
    </div>
  );
}
