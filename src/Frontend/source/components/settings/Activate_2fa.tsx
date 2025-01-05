'use client'
import { Switch } from '@/components/ui/switch';
import SettingsServices from '@/services/settingsServices';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface TwoFactorProps {
  update2fa: boolean;
  setUpdate2fa: (enabled: boolean) => void;
}

export const Activate_2fa: React.FC<TwoFactorProps> = ({update2fa, setUpdate2fa }) => {
  
  function handle2fa() {
    if (update2fa) {
      setUpdate2fa(false);
    } else {
      setUpdate2fa(true);
    }
  }
    return (
        <div className="w-full py-6 flex flex-wrap items-center justify-start h-fit gap-10">
        <div className="w-full h-[12%] flex items-center">
            <h1 className="text-white font-dayson font-bold text-xl tracking-wider transition-all duration-200 opacity-[80%]">
              Two Factor Authentication
          </h1>
        </div>
        <div className="w-full h-[50%] flex items-start justify-between flex-col gap-4">
          <p className="font-coustard text-lg text-white opacity-[80%]">
            Two Factor Authentication protects your account by <br />
            requiring an additional code when you log in on a new device.<br />
          </p>
          <div className="w-full h-[50%] flex items-center justify-start flex-row gap-10">
          <h1 className="font-coustard text-xl text-white">
            {update2fa ? 'Enabled' : 'Disabled'}
          </h1>
            <Switch checked={update2fa} onCheckedChange={handle2fa}/>
          </div> 
        </div>
      </div>
    )
};