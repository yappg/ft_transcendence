"use client";
import { Switch } from "@/components/ui/switch";
import SettingsServices from "@/services/settingsServices";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
/* eslint-disable tailwindcss/no-custom-classname */
interface TwoFactorProps {
  update2fa: boolean;
  setUpdate2fa: (enabled: boolean) => void;
}

export const Activate_2fa: React.FC<TwoFactorProps> = ({
  update2fa,
  setUpdate2fa,
}) => {
  function handle2fa() {
    if (update2fa) {
      setUpdate2fa(false);
    } else {
      setUpdate2fa(true);
    }
  }
  return (
    <div className="flex h-fit w-full flex-wrap items-center justify-start gap-10 py-6">
      <div className="flex h-[12%] w-full items-center">
        <h1 className="font-dayson text-xl font-bold tracking-wider text-white opacity-[80%] transition-all duration-200">
          Two Factor Authentication
        </h1>
      </div>
      <div className="flex h-1/2 w-full flex-col items-start justify-between gap-4">
        <p className="font-coustard text-lg text-white opacity-[80%]">
          Two Factor Authentication protects your account by <br />
          requiring an additional code when you log in on a new device.
          <br />
        </p>
        <div className="flex h-1/2 w-full flex-row items-center justify-start gap-10">
          <h1 className="font-coustard text-xl text-white">
            {update2fa ? "Enabled" : "Disabled"}
          </h1>
          <Switch checked={update2fa} onCheckedChange={handle2fa} />
        </div>
      </div>
    </div>
  );
};
