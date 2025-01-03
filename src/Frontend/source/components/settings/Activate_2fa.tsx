'use client'
import { Switch } from '@/components/ui/switch';
import SettingsServices from '@/services/settingsServices';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TwoFactorProps {
  twoFactor: boolean;
  setEnabled2fa: (enabled: boolean) => void;
}

export const Activate_2fa: React.FC<TwoFactorProps> = ({ twoFactor, setEnabled2fa }) => {
  const [enabled2fa, setEnabled2faa] = useState(twoFactor);
  
  const handle2fa = async () => {
    try {
      if (enabled2fa) {
        await SettingsServices.update2fa(false);
        setEnabled2faa(false);
        setEnabled2fa(false);
      } else {
        setEnabled2faa(true);
        setEnabled2fa(true);
      }
    } catch (error) {
      console.log('error', error);
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
            {enabled2fa ? 'Enabled' : 'Disabled'}
          </h1>
            <Switch checked={enabled2fa} onCheckedChange={handle2fa}/>
          </div> 
        </div>
      </div>
    )
};