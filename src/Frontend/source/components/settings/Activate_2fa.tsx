import { Switch } from '@/components/ui/switch';
interface TwoFactorProps {
  profileState: {
    avatar: string;
    cover: string;
    profileError: string;
    coverError: string;
    username: string;
    display_name: string;
    password: string;
    NewPassword: string;
    is_private: boolean;
  };
  setProfileState: React.Dispatch<React.SetStateAction<any>>;
}

export const Activate_2fa = ({profileState, setProfileState}: TwoFactorProps) => {
    return (
        <div className="w-full py-6 flex flex-wrap items-center justify-start h-fit gap-10 border-2 bg-[#00000099] rounded-[50px] shadow-2xl p-7 border-[#B8B8B8]">
        <div className="w-full h-[12%] flex items-center">
          <h1 className="text-white font-dayson font-bold text-2xl tracking-wider hover:border-b-2 transition-all duration-200">
            Two Factor Authentication
          </h1>
        </div>
        <div className="w-full h-[50%] 2xl:pl-16 xl:pl-10 flex items-start justify-between flex-col">
          <p className="font-coustard text-lg text-white opacity-[80%]">
            Two Factor Authentication protects your account by <br />
            requiring an additional code when you log in on a new device.<br />
          </p>
          <div className="w-full h-[50%] flex items-center justify-start flex-row gap-5">
            <h1 className="font-coustard text-xl text-white">Activate 2FA</h1>
            <Switch />
          </div>
        </div>
      </div>
    )
};